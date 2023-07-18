import { z } from 'zod'

import { SENSOR_DATA_TOPIC_REGEX, UUID_REGEX } from '../constants'

export const sensorDataSchema = z.object({
  source_address: z.string().regex(UUID_REGEX),
  tx_time_ms_epoch: z.number(),
  data: z.unknown(),
  sensor_id: z.number(),
})

export type SensorData = (
  z.infer<typeof sensorDataSchema> &
  ReturnType<typeof SENSOR_DATA_TOPIC_REGEX.captures>
)

type SensorDataEventMap = {
  'sensor-data': SensorData
}

export class SensorDataEvent {
  private listeners: Record<
    keyof SensorDataEventMap,
    ((event: SensorDataEventMap[keyof SensorDataEventMap]) => void)[]
  > = {
      'sensor-data': [],
    }

  addEventListener<EventType extends keyof SensorDataEventMap>(
    type: EventType,
    callback: (event: SensorDataEventMap[EventType]) => void,
  ): void {
    this.listeners[type].push(callback)
  }

  dispatchEvent<EventType extends keyof SensorDataEventMap>(
    eventType: EventType,
    data: SensorDataEventMap[EventType],
  ): boolean {
    const listeners = this.listeners[eventType as keyof SensorDataEventMap]

    if (listeners === undefined) {
      return false
    }

    for (const listener of listeners) {
      listener(data)
    }

    return true
  }

  removeEventListener<EventType extends keyof SensorDataEventMap>(
    type: EventType,
    callback: (event: SensorDataEventMap[EventType]) => void,
  ): void {
    const listeners = this.listeners[type]

    if (listeners === undefined) {
      return
    }

    const index = listeners.indexOf(callback)

    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}

export const sensorDataEvent = new SensorDataEvent()
