"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { BarChart as TremorBarChart } from "@tremor/react"
import { LineChart as TremorLineChart } from "@tremor/react"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({ data, index, categories, colors, valueFormatter, className }: ChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <TremorBarChart
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      className={className}
      showLegend={false}
      showGridLines={false}
      theme={theme === "dark" ? "dark" : "light"}
    />
  )
}

export function LineChart({ data, index, categories, colors, valueFormatter, className }: ChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <TremorLineChart
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      className={className}
      showLegend={false}
      showGridLines={false}
      theme={theme === "dark" ? "dark" : "light"}
    />
  )
}
