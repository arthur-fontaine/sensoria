import { sensorDataEvent } from './utils/sensor-data-event'

import { database } from '../../db'
import { measures } from '../../db/schema'

export const realtimeAddMqttDataToDb = () => {
  sensorDataEvent.addEventListener('sensor-data', (event) => {
    const data = event.data

    if (typeof data !== 'object' || data === null) {
      throw new Error('Cannot handle data that is not an object.')
    }

    if (Object.keys(data).length > 0) {
      throw new Error('Cannot handle more than one data.')
    }

    const [measureType, value] = Object.entries(data)[0] ?? []

    if (measureType === undefined || value === undefined) {
      throw new Error('Cannot find measureType or value.')
    }

    database.transaction(async (tx) => {
      await tx
        .insert(measures)
        .values([{
          measureType,
          sensorId: event.sensor_id,
          timestamp: new Date(event.tx_time_ms_epoch * 1000),
          value,
        }])

      return
    })
  })
}
