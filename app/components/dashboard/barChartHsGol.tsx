'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const Label = ({ x, y, value }: { x?: any; y?: any; value?: any }) => (
  <text
    x={x}
    y={y}
    dx={'1%'}
    dy={'+6%'}
    fontSize='10'
    fill='#F1F1F1'
    textAnchor='right'
  >
    {value}
  </text>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip bg-default-100'>
        <p className='label'>{`${label} : S/. ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

type AppProps = {
  incomeByDayOdWeek: any
}

export function Overview({ incomeByDayOdWeek }: AppProps) {
  console.log(incomeByDayOdWeek)
  return (
    <ResponsiveContainer width='100%' height={150}>
      <BarChart data={incomeByDayOdWeek}>
        <XAxis
          dataKey='diaSemana'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey='ingresos'
          fill='#b32020'
          radius={[4, 4, 0, 0]}
          label={<Label />}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
