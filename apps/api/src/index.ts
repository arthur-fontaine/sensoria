import { type InferResolvers, buildSchema, g } from 'garph'

import type { Context } from './context'
import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import {
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { loginQueryResolver } from './resolvers/queries/authentication'
import { getAlarmsQueryResolver } from './resolvers/queries/get-alarms'
import {
  getLastMeasureFromObjectQueryResolver, getMeasuresFromObjectQueryResolver,
  getObjectsQueryResolver, getTagsFromObjectQueryResolver,
  getThresholdsFromObjectQueryResolver,
} from './resolvers/queries/get-objects'
import { blockInputType, blockType } from './schemas/block'
import type { hallType } from './schemas/hall'
import type { measureType } from './schemas/measure'
import { objectType } from './schemas/object'
import type { tagType } from './schemas/tag'
import type { thresholdType } from './schemas/threshold'
import type { thresholdTriggerType } from './schemas/threshold-trigger'
import type { triggerType } from './schemas/trigger'
import { alarmsType } from './types/alarms'

export const queryType = g.type('Query', {
  authentication: g.string()
    .args({
      email: g.string(),
      password: g.string(),
    }),
  objects: g.ref(() => objectType).list()
    .description('Get all objects'),
  getAlarms: g.ref(alarmsType).list()
    .description('Get all alarms'),
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

export type Resolvers = InferResolvers<{
  Query: typeof queryType
  Mutation: typeof mutationType
  Block: typeof blockType
  Hall: typeof hallType
  Measure: typeof measureType
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
    getAlarms: getAlarmsQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
    modifyPassword: modifyPasswordMutationResolver,
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
