type THeatmapPoint = {
  x: number
  y: number
  value: number
}

const getKey = (point: THeatmapPoint) => `${point.x}-${point.y}`
const clamp = (min: number, max: number, value: number): number =>
  Math.min(max, Math.max(min, value))
const isValidPoint = ({ x, y }: THeatmapPoint, size: number): boolean =>
  x >= 0 && y >= 0 && y < size && x < size

const MINIMAL_CELL_SIZE = 4
const PADDING = 8
const STROKE_WIDTH = 1

export class HeatmapChart {
  private map: Map<string, THeatmapPoint> = new Map()
  private meta?: {
    cellSize: number
    gridSize: number
  }

  constructor(
    private ctx: CanvasRenderingContext2D,
    private parent: HTMLElement,
    private canvas: HTMLCanvasElement,
    private size: number,
  ) {}

  render() {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.ctx.clearRect(0, 0, width, height)
    this.#prepareMeta()
    // Full redraw: draw points first (no per-cell clear), then grid on top
    this.#renderPoints(this.map.values(), false)
    this.#renderGrid()
  }

  #prepareMeta() {
    const { width, height } = this.parent.getBoundingClientRect()

    const availableWidth = width - PADDING * 2
    const availableHeight = height - PADDING * 2

    const cellLimitByWidth = Math.floor(availableWidth / this.size)
    const cellLimitByHeight = Math.floor(availableHeight / this.size)

    const cellSize = Math.max(MINIMAL_CELL_SIZE, Math.min(cellLimitByWidth, cellLimitByHeight))

    const gridSize = cellSize * this.size
    this.meta = { cellSize, gridSize }
  }

  #renderGrid() {
    if (!this.meta) return
    const { cellSize, gridSize } = this.meta

    this.ctx.strokeStyle = '#ccc'
    this.ctx.lineWidth = STROKE_WIDTH

    // Vertical lines
    this.ctx.beginPath()
    for (let i = 0; i <= this.size; i++) {
      const x = PADDING + cellSize * i
      this.ctx.moveTo(x, PADDING)
      this.ctx.lineTo(x, PADDING + gridSize)
    }
    this.ctx.stroke()

    // Horizontal lines
    this.ctx.beginPath()
    for (let j = 0; j <= this.size; j++) {
      const y = PADDING + cellSize * j
      this.ctx.moveTo(PADDING, y)
      this.ctx.lineTo(PADDING + gridSize, y)
    }
    this.ctx.stroke()
  }

  addPoint(point: THeatmapPoint) {
    if (!isValidPoint(point, this.size)) return

    const incoming = { ...point, value: clamp(0, 1, point.value) }
    const key = getKey(incoming)
    const existing = this.map.get(key)

    const next = existing
      ? { ...existing, value: clamp(0, 1, existing.value + incoming.value) }
      : incoming

    this.map.set(key, next)

    this.#renderPoint(next, true)
  }

  #renderPoint = ({ x, y, value }: THeatmapPoint, clearFirst: boolean) => {
    if (!this.meta) return
    const { cellSize } = this.meta

    const inset = STROKE_WIDTH // keep grid lines intact
    const pointX = PADDING + cellSize * x + inset
    const pointY = PADDING + cellSize * y + inset
    const fillSize = cellSize - inset * 2

    if (clearFirst) {
      this.ctx.clearRect(pointX, pointY, fillSize, fillSize)
    }

    // Per-cell alpha => must fill per cell (cannot batch with varying fillStyle)
    this.ctx.fillStyle = `rgba(255, 0, 0, ${clamp(0, 1, value)})`
    this.ctx.fillRect(pointX, pointY, fillSize, fillSize)
  }

  #renderPoints(points: IterableIterator<THeatmapPoint>, clearFirst: boolean) {
    for (const p of points) this.#renderPoint(p, clearFirst)
  }
}
