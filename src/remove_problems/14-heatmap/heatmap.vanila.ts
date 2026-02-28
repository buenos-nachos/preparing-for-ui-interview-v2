import { AbstractComponent, type TComponentConfig } from '../00-abstract-component/component'
import styles from './heatmap.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

type TProps = {}

export class Heatmap extends AbstractComponent<TProps> {
  constructor(config: TComponentConfig<TProps>) {
    super(config)
  }

  toHTML(): string {
    return '<div>TODO: Implement</div>'
  }
}
