import { type InferResolvers, buildSchema, g } from 'garph'

import type { Context } from './context'
import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import {
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { loginQueryResolver } from './resolvers/queries/authentication'
import {
  getMeasureFromNotificationsQueryResolver,
  getNotificationsQueryResolver,
} from './resolvers/queries/get-notifications'
import {
  getLastMeasureFromObjectQueryResolver, getMeasuresFromObjectQueryResolver,
  getObjectsQueryResolver, getTagsFromObjectQueryResolver,
  getThresholdsFromObjectQueryResolver,
} from './resolvers/queries/get-objects'
import { getRolesQueryResolver } from './resolvers/queries/get-roles'
import {
  sensorDataSubscribeResolver,
} from './resolvers/subscriptions/subscribe-to-sensor-data'
import { blockInputType, blockType } from './schemas/block'
import type { hallType } from './schemas/hall'
import { measureType } from './schemas/measure'
import { notificationsType } from './schemas/notifications'
import { objectType } from './schemas/object'
import { roleType } from './schemas/roles'
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
      id: g.int().optional(),
    })
    .description('Get all objects'),
  notifications: g.ref(() => notificationsType).list()
    .description('Get all notifications'),
  roles: g.ref(() => roleType).list()
    .description('Get all roles'),
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
  Notifications: typeof notificationsType
  Object: typeof objectType
  Tag: typeof tagType
  Threshold: typeof thresholdType
  ThresholdTrigger: typeof thresholdTriggerType
  Trigger: typeof triggerType
}, { context: Context }>

const resolvers: Resolvers = {
  Query: {
    objects: getObjectsQueryResolver,
    authentication: loginQueryResolver,
    notifications: getNotificationsQueryResolver,
    roles: getRolesQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
    modifyPassword: modifyPasswordMutationResolver,
  },
  Subscription: {
    sensorData: sensorDataSubscribeResolver,
  },
  Object: {
    lastMeasure: getLastMeasureFromObjectQueryResolver,
    measures: getMeasuresFromObjectQueryResolver,
    tags: getTagsFromObjectQueryResolver,
    thresholds: getThresholdsFromObjectQueryResolver,
  },
  Block: {
    // halls: getHallsFromBlockQueryResolver,
  },
  Hall: {
    // block: getBlockFromHallQueryResolver,
    // objects: getObjectsFromHallQueryResolver,
  },
  Measure: {
    // sensor: getSensorFromMeasureQueryResolver,
  },
  Notifications: {
    measure: getMeasureFromNotificationsQueryResolver,
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
