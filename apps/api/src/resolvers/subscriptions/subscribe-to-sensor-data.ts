import type { Resolvers } from '../..'
import {
  SensorData, sensorDataEvent,
} from '../../services/mqtt/utils/sensor-data-event'

type GetSensorDataSubscriptionResolver = NonNullable<
  NonNullable<Resolvers['Subscription']['sensorData']>['subscribe']
>

export const sensorDataSubscribeResolver: GetSensorDataSubscriptionResolver = (
  async function* (_parent, args, _context, _info) {
    for await (const data of getSensorData({
      blockId: args.blockId ?? undefined,
      sensorId: args.sensorId ?? undefined,
    })) {
      yield {
        sensorData: data,
      }
    }
  }
)

const sensorData: Set<SensorData> = new Set()

async function* getSensorData(args: {
  blockId?: number | undefined
  sensorId?: number | undefined
} = {}) {
  let dataToSend: SensorData[] = []

  sensorDataEvent.addEventListener('sensor-data', (data) => {
    if (data.sensor_id !== args.sensorId) {
      return
    }

    sensorData.add(data)
    dataToSend.push(data)
  })

  for await (const _ of infiniteLoop()) {
    for (const data of dataToSend) {
      yield {
        measureType: data.measure_type,
        value: data.data.value,
        timestamp: data.tx_time_ms_epoch,
        sensor: {},
      }
    }

    dataToSend = []
  }
}

async function* infiniteLoop() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    yield
  }
}
