import { tokenize, toRpn, type CellId, type Compiled } from '../../../utilities/google-sheet-parser'

export type { CellId } from '../../../utilities/google-sheet-parser'

/**
 * Spreadsheet engine with formula compilation.
 *
 * Extends the basic engine with formula parsing: `setRaw` now tokenizes and
 * converts formulas to RPN, extracts cell references as dependencies, and
 * maintains forward/reverse dependency maps.
 *
 * Display value is still set to raw text (no evaluation yet).
 */
export class TableEngine {
  /* Raw user input for each cell (e.g. "=A1+B1" or "42") */
  #raw: Map<CellId, string> = new Map()
  /* Computed display value for each cell (in this version, same as raw) */
  #val: Map<CellId, string> = new Map()
  /* Forward dependencies: cell → set of cells it depends on */
  #deps: Map<CellId, Set<CellId>> = new Map()
  /* Reverse dependencies: cell → set of cells that depend on it */
  #reverseDeps: Map<CellId, Set<CellId>> = new Map()
  /* Compiled formula AST for each cell */
  #compiled: Map<CellId, Compiled> = new Map()

  /**
   * Sets the raw input for a cell, compiles any formula, updates deps.
   * Returns the list of cells whose display value changed (just the cell itself).
   * In later versions, this will also recompute dependents.
   */
  setRaw(id: CellId, raw: string): { changed: CellId[] } {
    this.#raw.set(id, raw)

    // Set value as raw text for now (no computation yet)
    this.#val.set(id, raw)

    const deps = this.#compile(id, raw)
    this.setDeps(id, deps)

    return { changed: [id] }
  }

  /** Returns the raw user input for a cell, or empty string if unset. */
  getRaw(id: CellId): string {
    return this.#raw.get(id) ?? ''
  }

  /** Returns the computed display value for a cell, or empty string if unset. */
  getValue(id: CellId): string {
    return this.#val.get(id) ?? ''
  }

  /**
   * Returns the set of cells that the given cell depends on (forward deps).
   * Lazily initializes an empty set if none exists.
   */
  getDeps(id: CellId): Set<CellId> {
    let s = this.#deps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#deps.set(id, s)
    }
    return s
  }

  /**
   * Returns the set of cells that depend on the given cell (reverse deps).
   * Lazily initializes an empty set if none exists.
   */
  getRevDeps(id: CellId): Set<CellId> {
    let s = this.#reverseDeps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#reverseDeps.set(id, s)
    }
    return s
  }

  /** Updates forward and reverse dependency maps when a cell's deps change. */
  setDeps(id: CellId, nextDeps: Set<CellId>) {
    const prevDeps = this.getDeps(id)

    for (const dep of prevDeps) {
      if (!nextDeps.has(dep)) this.getRevDeps(dep).delete(id)
    }
    for (const dep of nextDeps) {
      if (!prevDeps.has(dep)) this.getRevDeps(dep).add(id)
    }

    this.#deps.set(id, nextDeps)
  }

  /**
   * Compiles a cell's raw input into RPN tokens.
   * - Plain text: stores null compiled, returns empty deps.
   * - Formula (starts with '='): tokenizes, converts to RPN, extracts cell refs as deps.
   * - On error: stores { error } compiled, returns empty deps.
   */
  #compile(id: CellId, raw: string): Set<CellId> {
    const deps = new Set<CellId>()
    raw = raw.trim()

    if (!raw.startsWith('=')) {
      this.#compiled.set(id, null)
      return deps
    }

    const expr = raw.slice(1).trim()

    const tokens = tokenize(expr)
    if (!tokens.ok) {
      this.#compiled.set(id, { error: tokens.error })
      return deps
    }

    const rpn = toRpn(tokens.tokens)
    if (!rpn.ok) {
      this.#compiled.set(id, { error: rpn.error })
      return deps
    }

    for (const t of rpn.rpn) {
      if (t.t === 'ref') deps.add(t.id)
    }

    this.#compiled.set(id, { rpn: rpn.rpn })
    return deps
  }

  /* Exposed for testing */
  _getCompiled(id: CellId): Compiled | undefined {
    return this.#compiled.get(id)
  }
}
