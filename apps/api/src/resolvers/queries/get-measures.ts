import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetSensorFromMeasureQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Measure']['sensor']>>
)

export const getSensorFromMeasureQueryResolver:
  GetSensorFromMeasureQueryResolver = (
    async (parent, _args, _context, _info) => {
      const sensor = await database.query.objects
        .findFirst({
          where: (object, { eq }) => eq(object.objectId, parent.sensorId),
        })

      if (sensor === undefined) {
        throw new Error('Sensor not found')
      }

      return sensor
    }
  )
