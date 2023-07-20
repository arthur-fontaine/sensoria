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
      })
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
            timestamp: measure.timestamp.getTime().toString(),
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
            timestamp: measure.timestamp.getTime().toString(),
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

type GetHallFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['hall']>>
)

export const getHallFromObjectQueryResolver:
  GetHallFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      const hallId = parent.hallId

      if (hallId === null || hallId === undefined) {
        return
      }

      return database.query.halls
        .findFirst({
          where: (hall, { eq }) => eq(hall.hallId, hallId),
        })
    }
  )

type GetIsAvailableFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['isAvailable']>>
)

export const getIsAvailableFromObjectQueryResolver:
  GetIsAvailableFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return (
        parent.installationDate === null &&
        parent.hallId === null &&
        parent.emplacement === null
      )
    }
  )

type GetBatteryLevelFromObjectQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Object']['batteryLevel']>>
)

export const getBatteryLevelFromObjectQueryResolver:
  GetBatteryLevelFromObjectQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.measures
        .findFirst({
          where: (measure, { eq }) => eq(measure.sensorId, parent.objectId),
          orderBy: (measure, { desc }) => desc(measure.timestamp),
        })
        .then((measure) => (
          measure && Number(measure.value)))
    }
  )
