import { readObjectsDump } from './objects-dump'
import { SensorData, sensorDataEvent } from './sensor-data-event'
import { database } from '../../../db'
import {
  objectTypes, objectConfigs, objects,
  blocks, measures,
} from '../../../db/schema'

const syncMqttDatabaseObjects = async (sensorData: SensorData) => {
  const objectsDump = readObjectsDump()

  const getIcon = (objectId: number) => {
    const sensor = objectsDump.sensors.find(
      (sensor) => sensor.id === objectId,
    )

    if (sensor === undefined) {
      return 'square'
    }

    if (sensor.icon !== undefined) {
      return sensor.icon
    }

    if (
      sensor.type !== undefined &&
      objectsDump.icons[sensor.type] !== undefined
    ) {
      return objectsDump.icons[sensor.type] ?? 'square'
    }

    return 'square'
  }

  await database.transaction(async (tx) => {
    await tx
      .insert(blocks)
      .values({
        blockId: -1,
        name: 'default',
        location: [0, 0],
      })
      .onConflictDoNothing({
        target: [blocks.blockId],
      })
      .execute()

    await tx
      .insert(objectTypes)
      .values(objectsDump.sensors.flatMap((sensor) => {
        if (sensor.type === undefined) {
          return []
        }

        return {
          name: sensor.type,
        }
      }))
      .execute()

    const availableObjectTypes = await tx
      .select()
      .from(objectTypes)
      .execute()

    for (const sensor of objectsDump.sensors) {
      const objectType = availableObjectTypes.find(
        (objectType) => objectType.name === sensor.type,
      )

      if (objectType === undefined) {
        continue
      }

      const { objectConfigId } = await tx
        .insert(objectConfigs)
        .values({
          config: {},
        })
        .returning({
          objectConfigId: objectConfigs.objectConfigId,
        })
        .execute()
        .then(([objectConfig]) => {
          if (objectConfig === undefined) {
            throw new Error('Object config not created')
          }

          return objectConfig
        })

      await tx
        .insert(objects)
        .values({
          objectId: sensor.id,
          name: sensor.name ?? '',
          blockId: -1,
          iconName: getIcon(sensor.id),
          maker: 'unknown',
          serialNumber: 'unknown',
          objectTypeId: objectType.objectTypeId,
          objectConfigId,
        })
        .onConflictDoNothing({
          target: [objects.objectId],
        })
        .execute()
    }
  })

  const { source_address, tx_time_ms_epoch, data, sensor_id } = sensorData

  if (typeof data !== 'object' || data === null) {
    return
  }

  if (Object.keys(data).length > 1) {
    console.error('Cannot handle multiple measures')
    return
  }

  const [measureType, value] = Object.entries(data)[0] as [string, any]

  await database
    .insert(measures)
    .values([{
      measureType: measureType,
      value: Number(value).toString(),
      sensorId: sensor_id,
      timestamp: new Date(tx_time_ms_epoch * 1000),
    }])
}

sensorDataEvent.addEventListener('sensor-data', (data) => {
  syncMqttDatabaseObjects(data)
})
