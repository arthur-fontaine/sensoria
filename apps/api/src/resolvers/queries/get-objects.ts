import { SQL, isNull, not, or } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { objects } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'


type CreateBlockMutationResolver = NonNullable<
  Resolvers['Query']['objects']
>

export const getObjectsQueryResolver: CreateBlockMutationResolver = (
  (_parent, _args, _context, _info) => {
    return getObjects()
  }
)

async function getObjects() {
  return database
    .select({
      objectId: objects.objectId,
      name: objects.name,
      iconName: objects.iconName,
      installationDate: objects.installationDate,
      isAvailable: or(
        isNull(objects.installationDate),
        isNull(objects.emplacement),
        isNull(objects.hallId),
      ) as SQL<boolean>,
    })
    .from(objects)
}
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
    if( hallId === undefined || hallId === null){
      return
    }
    return database.query.halls
    .findFirst({
      where: (halls , {eq}) => 
      eq(halls.hallId, hallId)
    })
    .then((hall) => {
      if(hall === undefined){
        return hall
      }
      return {
        ...hall,
        map: {base64: hall.map.toString("base64url")}
       }
  })
  }
)
