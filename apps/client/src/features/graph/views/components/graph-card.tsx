// import React from 'react'
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import { Card, CardTitle } from '@/shared/components/ui/card'
import { useQuery } from '@/shared/hooks/use-query'


interface ModalProperties {
  objectSelect: {
    time: string | undefined,
    sensors: string | undefined,
    stages: string | undefined,
  }
}

export function GraphCard(properties: ModalProperties) {

  const { time, sensors, stages } = properties.objectSelect;

  const measures = useQuery().objects().flatMap((object) => object.measures)

  const filteredMeasures = measures.filter(measure => {

    const currentTimeInMilliseconds = new Date().getTime()

    if (time === "Jour") {
      const timestampDayAgo = new Date().getTime()
        - (24 * 60 * 60 * 1000)

      if (Number(measure.timestamp) < timestampDayAgo) {
        return false
      }
    }
    if (time === "Semaine") {
      const timestampWeekAgo = currentTimeInMilliseconds - 
      (7 * 24 * 60 * 60 * 1000)

      if (Number(measure.timestamp) < timestampWeekAgo) {
        return false
      }
    }
    if (time === "Mois") {
      const timestampMonthAgo = currentTimeInMilliseconds - 
      (30 * 24 * 60 * 60 * 1000)

      if (Number(measure.timestamp) < timestampMonthAgo) {
        return false
      }
    }
    if (time === "Année") {
      const timestampYearsAgo = currentTimeInMilliseconds - 
      (365.25 * 24 * 60 * 60 * 1000)

      if (Number(measure.timestamp) < timestampYearsAgo) {
        return false
      }
    }

    if (sensors !== undefined && measure.measureType !== sensors) {
      return false;
    }

    if (stages !== undefined && measure.sensor.hall?.label !== stages) {
      return false
    }
    return true
  })
  
  console.log(JSON.parse(JSON.stringify(filteredMeasures)))

  return (
    <>
      <Card className="m-auto w-[800px] h-[400px] p-6">
        <CardTitle className='mb-4'></CardTitle>

        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            width={500}
            height={300}
            data={JSON.parse(JSON.stringify(filteredMeasures))}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" strokeWidth="2px" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  )
}
