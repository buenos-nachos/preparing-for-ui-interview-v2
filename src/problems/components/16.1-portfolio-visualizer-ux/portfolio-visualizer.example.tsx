import { useRef, useEffect } from 'react'
import { PortfolioVisualizer as PortfolioVisualizerStudent } from './portfolio-visualizer.react'
import { PortfolioVisualizer, type TPortfolioNode } from './solution/portfolio-visualizer.react'
import { PortfolioVisualizer as VanillaPortfolioVisualizer } from './solution/portfolio-visualizer.vanila'
import { PortfolioVisualizer as StudentVanillaPortfolioVisualizer } from './portfolio-visualizer.vanila'

const SAMPLE_DATA: TPortfolioNode = {
  id: 'portfolio',
  name: 'Portfolio',
  value: 300000,
  children: [
    {
      id: 'stocks',
      name: 'Stocks',
      value: 100000,
      children: [
        { id: 'aapl', name: 'AAPL', value: 30000 },
        { id: 'googl', name: 'GOOGL', value: 25000 },
        { id: 'msft', name: 'MSFT', value: 20000 },
        { id: 'amzn', name: 'AMZN', value: 25000 },
      ],
    },
    {
      id: 'commodities',
      name: 'Commodities',
      value: 100000,
      children: [
        {
          id: 'metals',
          name: 'Metals',
          value: 50000,
          children: [
            { id: 'gold', name: 'Gold', value: 30000 },
            { id: 'silver', name: 'Silver', value: 20000 },
          ],
        },
        { id: 'oil', name: 'Oil', value: 25000 },
        { id: 'gas', name: 'Gas', value: 25000 },
      ],
    },
    {
      id: 'treasuries',
      name: 'Treasuries',
      value: 100000,
      children: [
        {
          id: 'usa',
          name: 'USA',
          value: 60000,
          children: [
            { id: 'usa-20y', name: '20 Year Bonds', value: 35000 },
            { id: 'usa-10y', name: '10 Year Bonds', value: 25000 },
          ],
        },
        {
          id: 'uk',
          name: 'UK',
          value: 40000,
          children: [
            { id: 'uk-20y', name: '20 Year Gilts', value: 25000 },
            { id: 'uk-10y', name: '10 Year Gilts', value: 15000 },
          ],
        },
      ],
    },
  ],
}

export function PortfolioVisualizerExample() {
  return <PortfolioVisualizer data={SAMPLE_DATA} />
}

export function PortfolioVisualizerVanillaExample() {
  const rootRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<VanillaPortfolioVisualizer | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    componentRef.current = new VanillaPortfolioVisualizer({
      root: rootRef.current,
      data: SAMPLE_DATA,
    })
    componentRef.current.render()
    return () => {
      componentRef.current?.destroy()
      componentRef.current = null
    }
  }, [])

  return <div ref={rootRef}></div>
}
export const PortfolioVisualizerStudentExample = () => {
  return <PortfolioVisualizerStudent />
}

export function PortfolioVisualizerStudentVanillaExample() {
  const rootRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<StudentVanillaPortfolioVisualizer | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    componentRef.current = new StudentVanillaPortfolioVisualizer({
      root: rootRef.current,
      data: SAMPLE_DATA,
    })
    if (componentRef.current.render) componentRef.current.render()
    return () => {
      componentRef.current?.destroy?.()
      componentRef.current = null
    }
  }, [])

  return <div ref={rootRef}></div>
}
