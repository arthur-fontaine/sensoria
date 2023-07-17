import { SQL, isNull, desc, eq, or } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import {
  objects, objectsToTags, measures, tags, thresholds,
  thresholdsTriggers, triggers,
} from '../../db/schema'

type CreateBlockMutationResolver = NonNullable<
  Resolvers['Query']['objects']
>

export const getObjectsQueryResolver: CreateBlockMutationResolver = (
  (_parent, args, _context, _info) => {
    return getObjects(args.id ?? undefined)
  }
)

function getObjects(id?: number) {
  return [{
    objectId: 1,
    name: 'test',
    description: 'Test de description bien longue bla blabla bla blip',
    iconName: 'diamond',
    emplacement: [0.5, 0.5] as [number, number],
    isAvailable: false,
    lastMeasure: {
      measureType: 'temperature',
      value: 20,
      timestamp: 123_456_789,
      sensor: {
        objectId: 1,
        name: 'test',
        iconName: 'diamond',
        emplacement: [0.5, 0.5] as [number, number],
        isAvailable: false,
        description: 'description',
        batteryLevel: 0.5,
        tags: [
          {
            tagId: 1,
            name: 'tag1',
          },
          {
            tagId: 2,
            name: 'tag2',
          },
        ],
        thresholds: [],
      },
    },
    batteryLevel: 0.5,
    tags: [
      {
        tagId: 1,
        name: 'tag1',
      },
      {
        tagId: 2,
        name: 'tag2',
      },
    ],
    thresholds: [
      {
        thresholdId: 1,
        minimum: 10,
        maximum: 30,
        triggers: [
          {
            on: 'lessThanMin',
            trigger: {
              newState: false,
              object: {
                objectId: 2,
                name: 'test2',
                iconName: 'diamond',
                emplacement: [0.5, 0.5] as [number, number],
                isAvailable: false,
                description: 'description',
                batteryLevel: 0.5,
                tags: [
                  {
                    tagId: 1,
                    name: 'tag1',
                  },
                ],
                thresholds: [],
              },
            },
          },
        ],
        sensor: {
          objectId: 1,
          name: 'test',
          iconName: 'diamond',
          emplacement: [0.5, 0.5] as [number, number],
          isAvailable: false,
          description: 'description',
          batteryLevel: 0.5,
          tags: [
            {
              tagId: 1,
              name: 'tag1',
            },
            {
              tagId: 2,
              name: 'tag2',
            },
          ],
          thresholds: [],
        },
      },
    ],
  }]
}

async function _getObjects(id?: number) {
  // TODO: may use _info to get the fields to select and avoid useless joins

  // const lastMeasureSq = database
  //   .select({
  //     measureId: measures.measureId,
  //     measureType: measures.measureType,
  //     measureValue: measures.value,
  //     timestamp: measures.timestamp,
  //   })
  //   .from(measures)
  //   .orderBy(desc(measures.measureId))
  //   .limit(1)
  //   .as('lastMeasure')

  // const batteryLevelSq = database
  //   .select({
  //     measureId: measures.measureId,
  //     measureValue: measures.value,
  //   })
  //   .from(measures)
  //   .where(eq(measures.measureType, 'batteryLevel'))
  //   .orderBy(desc(measures.measureId))
  //   .limit(1)
  //   .as('batteryLevel')

  // const thresholdsTriggersSq = database
  //   .select({
  //     thresholdId: thresholds.thresholdId,
  //     on: thresholdsTriggers.triggerEvent,
  //     triggers: {
  //       newState: triggers.newState,
  //     },
  //   })
  //   .from(thresholdsTriggers)
  //   .where(eq(thresholdsTriggers.thresholdId, thresholds.thresholdId))
  //   .as('thresholdsTriggers')

  // let query = database
  //   .select({
  //     objectId: objects.objectId,
  //     name: objects.name,
  //     description: objects.description,
  //     iconName: objects.iconName,
  //     emplacement: objects.emplacement,
  //     isAvailable: or(
  //       isNull(objects.installationDate),
  //       isNull(objects.emplacement),
  //       isNull(objects.hallId),
  //     ) as SQL<boolean>,
  //     lastMeasure: {
  //       measureId: lastMeasureSq.measureId,
  //       measureType: lastMeasureSq.measureType,
  //       measureValue: lastMeasureSq.measureValue,
  //       timestamp: lastMeasureSq.timestamp,
  //     },
  //     batteryLevel: batteryLevelSq.measureValue,
  //     tags: [tags.tagId],
  //     thresholds: {
  //       thresholdId: thresholds.thresholdId,
  //       minimum: thresholds.valueMin,
  //       maximum: thresholds.valueMax,
  //       on: thresholdsTriggersSq.on,
  //       newState: thresholdsTriggersSq.triggers.newState,
  //     },
  //   })
  //   .from(objects)
  //   .leftJoin(lastMeasureSq, eq(objects.objectId, lastMeasureSq.measureId))
  //   .leftJoin(batteryLevelSq, eq(objects.objectId, batteryLevelSq.measureId))
  //   .leftJoin(objectsToTags, eq(objects.objectId, objectsToTags.objectId))
  //   .leftJoin(tags, eq(objectsToTags.tagId, tags.tagId))
  //   .leftJoin(thresholds, eq(objects.objectId, thresholds.sensorId))
  //   .leftJoin(
  //     thresholdsTriggersSq,
  //     eq(thresholds.thresholdId, thresholdsTriggersSq.thresholdId),
  //   )

  // if (id) {
  //   query = query.where(eq(objects.objectId, id))
  // }

  // return query

  return database.query.objects.findMany({
    where: id === undefined
      ? undefined
      : (objects, { eq }) => eq(objects.objectId, id),
    with: {
      measures: {
        orderBy: desc(measures.measureId),
        limit: 1,
      },
      objectsToTags: {
        with: {
          tag: true,
        },
      },
      thresholds: {
        with: {
          thresholdsTriggers: {
            with: {
              trigger: true,
            },
          },
        },
      },
    },
    extras: (
      { installationDate, emplacement, hallId },
      { sql },
    ) => ({
      isAvailable: sql`(${
        or(
          isNull(installationDate),
          isNull(emplacement),
          isNull(hallId),
        )
      })`.as('isAvailable'),
      batteryLevel: sql<number>`
        SELECT ${measures.value}
        FROM ${measures}
        WHERE ${eq(measures.measureType, 'batteryLevel')}
        ORDER BY ${desc(measures.measureId)}
        LIMIT 1
      `.as('batteryLevel'),
    }),
  })
}
