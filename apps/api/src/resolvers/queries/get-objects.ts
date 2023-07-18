import { not } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetObjectsQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['objects']>>
)

export const getObjectsQueryResolver: GetObjectsQueryResolver = (
  (_parent, args, _context, _info) => {
    return database.query.objects
      .findMany({
        where: (objects, { eq }) => {
          if (args.id === undefined || args.id === null) {
            return
          }

          return eq(objects.objectId, args.id)
        },
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

        // cannot use `extras` yet because there is a bug in drizzle
      })
      .then((objects) =>
        objects.map(({ measures, ...object }) => {
          if (measures.length > 1) {
            throw new Error('Unexpected number of measures')
          }

          const measure = measures[0]

          if (measure !== undefined && measure.measureType !== 'battery') {
            throw new Error('Unexpected measure type (expected battery)')
          }

          const batteryLevel = measure?.value ?? 100

          return {
            ...object,
            isAvailable: (
              object.installationDate === null &&
              object.hallId === null &&
              object.emplacement === null
            ),
            batteryLevel: Number(batteryLevel),
          }
        }))
  }
)

type GetMeasuresFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['measures']>>
)

export const getMeasuresFromObjectQueryResolver:
  GetMeasuresFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.measures
        .findMany({
          where: (measure, { eq, and }) => and(
            eq(measure.sensorId, parent.objectId),
            not(eq(measure.measureType, 'battery')),
          ),
        })
        .then((measures) => (
          measures && measures.map((measure) => ({
            ...measure,
            value: Number(measure.value),
            timestamp: measure.timestamp.getTime(),
          }))))
    }
  )

type GetLastMeasureFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['lastMeasure']>>
)

export const getLastMeasureFromObjectQueryResolver:
  GetLastMeasureFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.measures
        .findFirst({
          where: (measure, { eq, and }) => and(
            eq(measure.sensorId, parent.objectId),
            not(eq(measure.measureType, 'battery')),
          ),
        })
        .then((measure) => (
          measure && {
            ...measure,
            value: Number(measure.value),
            timestamp: measure.timestamp.getTime(),
          }))
    }
  )

type GetTagsFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['tags']>>
)

export const getTagsFromObjectQueryResolver:
  GetTagsFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.objectsToTags
        .findMany({
          where: (objectToTag, { eq }) =>
            eq(objectToTag.objectId, parent.objectId),
          with: {
            tag: true,
          },
        })
        .then((objectsToTags) => (
          objectsToTags && objectsToTags.map(({ tag }) => tag)))
    }
  )

type GetThresholdsFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['thresholds']>>
)

export const getThresholdsFromObjectQueryResolver:
  GetThresholdsFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.thresholds
        .findMany({
          where: (threshold, { eq }) =>
            eq(threshold.sensorId, parent.objectId),
        })
        .then((thresholds) => (
          thresholds && thresholds.map((threshold) => ({
            ...threshold,
            minimum: Number(threshold.valueMin),
            maximum: Number(threshold.valueMax),
          }))))
    }
  )
