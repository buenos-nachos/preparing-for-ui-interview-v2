import { AbstractComponent } from '../../00-abstract-component/component'
import { HeatmapChart } from './heatmap-chart'
import styles from './heatmap.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

type THeatmapProps = {
  size?: number
}

export class Heatmap extends AbstractComponent<THeatmapProps> {
  private chart?: HeatmapChart
  private observer?: ResizeObserver

  constructor(config: THeatmapProps & { root: HTMLElement }) {
    super(config)
    this.config.size = this.config.size || 100
  }

  toHTML() {
    return `
            <div class="${styles.container}">
                <canvas class="${cx(flex.wh100, styles.canvas)}"></canvas>
            </div>
        `
  }

  afterRender() {
    const canvas = this.container?.querySelector('canvas')
    if (!canvas || !this.container) return

    this.chart = new HeatmapChart(
      canvas.getContext('2d')!,
      this.container.querySelector(`.${styles.container}`) as HTMLElement,
      canvas,
      this.config.size!,
    )

    this.chart.render()

    this.observer = new ResizeObserver(([entry]) => {
      if (entry && canvas) {
        const { width, height } = entry.contentRect
        canvas.width = width
        canvas.height = height
        this.chart?.render()
      }
    })

    const wrapper = this.container.querySelector(`.${styles.container}`)
    if (wrapper) this.observer.observe(wrapper)
  }

  destroy() {
    super.destroy()
    this.observer?.disconnect()
  }

  // Expose method to add points for testing/usage
  addPoint(x: number, y: number, value: number) {
    this.chart?.addPoint({ x, y, value })
  }
}
