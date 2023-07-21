import { type InferResolvers, buildSchema, g } from 'garph'

import type { Context } from './context'
import { addUserMutationResolver } from './resolvers/mutations/add-user'
import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import {
  deleteObjectMutationResolver,
} from './resolvers/mutations/delete-object'
import { deleteUserMutationResolver } from './resolvers/mutations/delete-user'
import { editObjectMutationResolver } from './resolvers/mutations/edit-object'
import {
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { modifyRoleMutationResolver } from './resolvers/mutations/modify-roles'
import { loginQueryResolver } from './resolvers/queries/authentication'
import {
  getBlocksQueryResolver, getHallsFromBlockQueryResolver,
} from './resolvers/queries/get-blocks'
import { getObjectsFromHallQueryResolver } from './resolvers/queries/get-halls'
import {
  getSensorFromMeasureQueryResolver,
} from './resolvers/queries/get-measures'
import {
  getMeasureFromNotificationsQueryResolver,
  getNotificationsQueryResolver,
} from './resolvers/queries/get-notifications'
import {
  getBatteryLevelFromObjectQueryResolver,
  getIsAvailableFromObjectQueryResolver,
  getLastMeasureFromObjectQueryResolver, getMeasuresFromObjectQueryResolver,
  getObjectsQueryResolver, getTagsFromObjectQueryResolver,
  getThresholdsFromObjectQueryResolver,
} from './resolvers/queries/get-objects'
import { getRolesQueryResolver } from './resolvers/queries/get-roles'
import {
  getRoleFromUserQueryResolver,
  getUsersQueryResolver,
} from './resolvers/queries/get-users'
import {
  sensorDataSubscribeResolver,
} from './resolvers/subscriptions/subscribe-to-sensor-data'
import { blockInputType, blockType } from './schemas/block'
import type { hallType } from './schemas/hall'
import { measureType } from './schemas/measure'
import { notificationsType } from './schemas/notifications'
import { objectInputType, objectType } from './schemas/object'
import { roleType } from './schemas/roles'
import type { tagType } from './schemas/tag'
import type { thresholdType } from './schemas/threshold'
import type { thresholdTriggerType } from './schemas/threshold-trigger'
import type { triggerType } from './schemas/trigger'
import { userType } from './schemas/users'

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
    .description('Get all objects'),
  blocks: g.ref(() => blockType).list()
    .args({
      id: g.int().optional(),
    }),
  notifications: g.ref(() => notificationsType).list()
    .description('Get all notifications'),
  roles: g.ref(() => roleType).list().description('Get All Roles'),
  users: g.ref(() => userType).list().description('Get all Users'),
})

export const mutationType = g.type('Mutation', {
  modifyPassword: g.boolean()
    .args({
      token: g.string(),
      password: g.string(),
      newPassword: g.string(),
    }),
  modifyRole: g.boolean()
    .args({
      userId: g.int(),
      newRole: g.string(),
    }),
  deleteUser: g.boolean()
    .args({
      userId: g.int().required(),
    }),
  addUser: g.boolean()
    .args({
      name: g.string(),
      email: g.string(),
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
  Notifications: typeof notificationsType
  Object: typeof objectType
  Tag: typeof tagType
  Threshold: typeof thresholdType
  ThresholdTrigger: typeof thresholdTriggerType
  Trigger: typeof triggerType
  User: typeof userType
}, { context: Context }>

const resolvers: Resolvers = {
  Query: {
    objects: getObjectsQueryResolver,
    authentication: loginQueryResolver,
    notifications: getNotificationsQueryResolver,
    roles: getRolesQueryResolver,
    users: getUsersQueryResolver,
    blocks: getBlocksQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
    modifyPassword: modifyPasswordMutationResolver,
    deleteUser: deleteUserMutationResolver,
    addUser: addUserMutationResolver,
    modifyRole: modifyRoleMutationResolver,
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
    halls: getHallsFromBlockQueryResolver,
  },
  Hall: {
    // block: getBlockFromHallQueryResolver,
    objects: getObjectsFromHallQueryResolver,
  },
  Measure: {
    sensor: getSensorFromMeasureQueryResolver,
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
  User: {
    role: getRoleFromUserQueryResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
