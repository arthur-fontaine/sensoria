import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetSensorFromMeasureQueryResolver = (
    ResolverFunction<NonNullable<Resolvers['Measure']['sensor']>>
)

export const getSensorFromMeasureQueryResolver: GetSensorFromMeasureQueryResolver = (
    (parent, _args, _context, _info) => {
        return database.query.objects.findFirst({
            where: (objects, { eq }) => eq(objects.objectId, parent.sensorId),
            with: {
                measures: {
                    where: (measures, { eq }) => {
                    return eq(measures.measureType, 'battery')
                    },
                    orderBy: (measures, { desc }) => {
                    return desc(measures.timestamp)
                    },
                    limit: 1,
                },
            },
        })
            .then((sensor) => {
                if (sensor === undefined) {
                    throw new Error('Sensor not found')
                }

                const { measures, ...sensorWithoutMeasures } = sensor

                if (measures.length > 1) {
                throw new Error('Unexpected number of measures')
                }
    
                const measure = measures[0]
    
                if (measure !== undefined && measure.measureType !== 'battery') {
                throw new Error('Unexpected measure type (expected battery)')
                }

                const batteryLevel = measure?.value ?? 100

                return {
                  ...sensorWithoutMeasures,
                  isAvailable: (
                    sensorWithoutMeasures.installationDate === null &&
                    sensorWithoutMeasures.hallId === null &&
                    sensorWithoutMeasures.emplacement === null
                  ),
                  batteryLevel: Number(batteryLevel),
                }
            })
    })
