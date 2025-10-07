import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"

interface LollipopProps {
  height: number
  data: { name: string; value: number }[]
}

const MARGIN = { top: 20, right: 30, bottom: 30, left: 60 }

export const Lollipop = ({ height, data }: LollipopProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(300) // largura inicial padrão

  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = () => {
      setWidth(containerRef.current!.offsetWidth)
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  const boundsWidth = width - MARGIN.left - MARGIN.right
  const boundsHeight = height - MARGIN.top - MARGIN.bottom

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, boundsHeight])
    .padding(0.4)

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) || 1])
    .range([0, boundsWidth])

  return (
    <div ref={containerRef} className="w-full">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {xScale.ticks(5).map((tickValue, i) => (
            <g key={i}>
              <line
                x1={xScale(tickValue)}
                x2={xScale(tickValue)}
                y1={0}
                y2={boundsHeight}
                stroke="#fff"
                opacity={0.2}
              />
              <text
                x={xScale(tickValue)}
                y={boundsHeight + 12}
                fill="#fff"
                textAnchor="middle"
                fontSize={10}
              >
                {tickValue}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const y = yScale(d.name)! + yScale.bandwidth() / 2
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={xScale(d.value)}
                  y1={y}
                  y2={y}
                  stroke="#888"
                  strokeWidth={3}
                />
                <circle
                  cx={xScale(d.value)}
                  cy={y}
                  r={6}
                  fill={['#f87171', '#60a5fa', '#34d399'][i]}
                />
                <text
                  x={-5}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="#fff"
                  fontSize={12}
                >
                  {d.name}
                </text>
                <text
                  x={xScale(d.value) + 8}
                  y={y}
                  fill="#fff"
                  alignmentBaseline="middle"
                  fontSize={12}
                >
                  {d.value}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
