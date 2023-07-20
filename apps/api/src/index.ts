import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import {
  deleteObjectMutationResolver,
} from './resolvers/mutations/delete-object'
import { editObjectMutationResolver } from './resolvers/mutations/edit-object'
import {
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { loginQueryResolver } from './resolvers/queries/authentication'
import {
  getSensorFromMeasureQueryResolver,
} from './resolvers/queries/get-measures'
import {
  getBatteryLevelFromObjectQueryResolver,
  getIsAvailableFromObjectQueryResolver,
  getLastMeasureFromObjectQueryResolver, getMeasuresFromObjectQueryResolver,
  getObjectsQueryResolver, getTagsFromObjectQueryResolver,
  getThresholdsFromObjectQueryResolver,
} from './resolvers/queries/get-objects'
import {
  sensorDataSubscribeResolver,
} from './resolvers/subscriptions/subscribe-to-sensor-data'
import { blockInputType, blockType } from './schemas/block'
import type { hallType } from './schemas/hall'
import { measureType } from './schemas/measure'
import { objectInputType, objectType } from './schemas/object'
import type { tagType } from './schemas/tag'
import type { thresholdType } from './schemas/threshold'
import type { thresholdTriggerType } from './schemas/threshold-trigger'
import type { triggerType } from './schemas/trigger'

export const queryType = g.type('Query', {
  authentication: g.string()
    .args({
      email: g.string(),
      password: g.string(),
    }),
  objects: g.ref(() => objectType).list()
    .args({
      id: g.int().optional().description('The id of the object'),
    })
    .description('Get an objects by id'),
})

export const mutationType = g.type('Mutation', {
  modifyPassword: g.boolean()
    .args({
      token: g.string(),
      password: g.string(),
      newPassword: g.string(),
    }),
  createBlock: g.ref(() => blockType)
    .args({
      block: g.ref(() => blockInputType).required(),
      email: g.string().required(),
    })
    .description('Create a new block'),
  editObject: g.ref(() => objectType)
    .args({
      object: g.ref(() => objectInputType).required(),
    })
    .description('Edit an object'),
  deleteObject: g.boolean()
    .args({
      id: g.int().required().description('The id of the object'),
    })
    .description('Delete an object by id'),
})

export const subscriptionType = g.type('Subscription', {
  sensorData: g.ref(() => measureType)
    .args({
      blockId: g.int().optional(),
      sensorId: g.int().optional(),
    })
    .description('Get sensor data'),
})

export type Resolvers = InferResolvers<{
  Query: typeof queryType
  Mutation: typeof mutationType
  Subscription: typeof subscriptionType
  Block: typeof blockType
  Hall: typeof hallType
  Measure: typeof measureType
  Object: typeof objectType
  Tag: typeof tagType
  Threshold: typeof thresholdType
  ThresholdTrigger: typeof thresholdTriggerType
  Trigger: typeof triggerType
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    objects: getObjectsQueryResolver,
    authentication: loginQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
    modifyPassword: modifyPasswordMutationResolver,
    editObject: editObjectMutationResolver,
    deleteObject: deleteObjectMutationResolver,
  },
  Subscription: {
    sensorData: {
      subscribe: sensorDataSubscribeResolver,
      resolve: (payload) => payload,
    },
  },
  Object: {
    lastMeasure: getLastMeasureFromObjectQueryResolver,
    measures: getMeasuresFromObjectQueryResolver,
    tags: getTagsFromObjectQueryResolver,
    thresholds: getThresholdsFromObjectQueryResolver,
    isAvailable: getIsAvailableFromObjectQueryResolver,
    batteryLevel: getBatteryLevelFromObjectQueryResolver,
  },
  Block: {
    // halls: getHallsFromBlockQueryResolver,
  },
  Hall: {
    // block: getBlockFromHallQueryResolver,
    // objects: getObjectsFromHallQueryResolver,
  },
  Measure: {
    sensor: getSensorFromMeasureQueryResolver,
  },
  Tag: {},
  ThresholdTrigger: {
    // trigger: getTriggerFromThresholdTriggerQueryResolver,
    // threshold: getThresholdFromThresholdTriggerQueryResolver,
  },
  Threshold: {
    // triggers: getTriggersFromThresholdQueryResolver,
    // sensor: getSensorFromThresholdQueryResolver,
  },
  Trigger: {
    // object: getObjectFromTriggerQueryResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
