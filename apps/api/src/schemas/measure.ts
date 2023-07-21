import { g } from 'garph'

import { objectType } from './object'

export const measureType = g.type('Measure', {
  measureType: g.string().description('Measure type'),
  value: g.float().description('Measure value'),
  timestamp: g.string().description('Measure timestamp'),
  sensorId: g.int().description('The id of the sensor of the measure'),
  sensor: g.ref(() => objectType)
    .omitResolver()
    .description('Sensor'),
})
