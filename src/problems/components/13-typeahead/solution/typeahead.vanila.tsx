import { AbstractComponent } from '../../00-abstract-component/component'
import { Trie } from './trie'
import styles from './typeahead.module.css'
import type { TTypeaheadEntry } from './typeahead.react'
import flex from '@course/styles'
import cx from '@course/cx'

type TTypeaheadProps = {
  id?: string
  onQuery: (query: string, signal?: AbortSignal) => Promise<TTypeaheadEntry<any>[]>
  itemRender?: (item: TTypeaheadEntry<any>) => string
}

export class Typeahead extends AbstractComponent<TTypeaheadProps> {
  // Step 2: State & Helpers
  private trie: Trie<TTypeaheadEntry<any>>
  private items: TTypeaheadEntry<any>[] = []
  private query: string = ''
  private isLoading: boolean = false
  private abortController: AbortController | null = null

  constructor(config: TTypeaheadProps & { root: HTMLElement }) {
    super({ ...config, listeners: ['input', 'click', 'keydown'] })
    this.trie = new Trie()
    this.config.id = this.config.id || 'typeahead-vanilla'
  }

  private get itemRender() {
    return this.config.itemRender || ((item: TTypeaheadEntry<any>) => item.id)
  }

  private updateTrie(entries: TTypeaheadEntry<any>[]) {
    entries.forEach((entry) => {
      this.trie.insert(entry.query, entry)
    })
  }

  // Read cached results from the Trie
  private updateVisibleItems() {
    this.items = this.trie.getWithPrefix(this.query)
    this.renderList()
  }

  public onInput(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.matches('input')) return

    this.query = target.value
    this.updateVisibleItems()
    this.fetchSuggestions()
  }

  public onClick(e: Event) {
    const target = e.target as HTMLElement
    const li = target.closest('li[data-id]') as HTMLElement
    if (!li) return

    const id = li.dataset.id
    const item = this.items.find((i) => i.id === id)
    if (!item) return

    this.query = item.query
    this.items = []
    const input = this.container?.querySelector('input') as HTMLInputElement
    if (input) {
      input.value = this.query
      input.focus()
    }
    this.renderList()
  }

  public onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.items = []
      this.renderList()
      const input = this.container?.querySelector('input') as HTMLInputElement
      if (input) input.focus()
      return
    }

    if (e.key === 'Enter' || e.key === ' ') {
      this.onClick(e)
      if (e.key === ' ') e.preventDefault() // prevent scrolling
    }
  }

  // Step 3 & 4: Async Fetching & Race Conditions
  private async fetchSuggestions() {
    this.isLoading = true
    this.renderList() // Update loading state UI

    // AbortController prevents race conditions (older slower requests overwriting newer fast ones)
    if (this.abortController) {
      this.abortController.abort()
    }
    this.abortController = new AbortController()
    const { signal } = this.abortController

    try {
      const entries = await this.config.onQuery(this.query, signal)
      this.updateTrie(entries)
      this.updateVisibleItems()
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error(error)
      }
    } finally {
      if (!signal.aborted) {
        this.isLoading = false
        this.renderList()
      }
    }
  }


  // Step 6: Rendering
  toHTML() {
    return `
            <section class="${styles.container}">
                <div role="status" class="${cx(flex.pAbs, styles.visuallyHidden)}" aria-live="polite">
                    ${this.items.length} results available.
                </div>
                <input 
                    id="${this.config.id}"
                    role="combobox" 
                    aria-autocomplete="list" 
                    aria-expanded="false" 
                    aria-controls="${this.config.id}-listbox"
                    class="${flex.w100}" 
                    type="text" 
                    value="${this.query}" 
                />
                <ul id="${this.config.id}-listbox" role="listbox" class="${cx(flex.bgWhite10, flex.shadow4, flex.padding8, flex.br4, styles.list)}" style="display: none;">
                </ul>
            </section>
        `
  }

  private renderList() {
    if (!this.container) return
    const list = this.container.querySelector(`.${styles.list}`) as HTMLElement
    const input = this.container.querySelector(`.${styles.input}`) as HTMLInputElement
    const status = this.container.querySelector(`.${styles.visuallyHidden}`) as HTMLElement
    if (!list || !input || !status) return

    const show = this.items.length > 0 || this.isLoading
    list.style.display = show ? 'grid' : 'none'
    input.setAttribute('aria-expanded', String(this.items.length > 0))
    status.textContent = `${this.items.length} results available.`

    let html = this.items
      .map(
        (item) => `
            <li tabindex="0" role="option" aria-selected="false" class="${cx(styles.item, flex.padding4)}" data-id="${item.id}">
                ${this.itemRender(item)}
            </li>
        `,
      )
      .join('')

    if (this.isLoading) {
      html += `<li role="status" class="${cx(styles.item, flex.padding4, flex.cBlack4)}">Loading...</li>`
    }

    list.innerHTML = html
  }
}
