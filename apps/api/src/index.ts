import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import {
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { loginQueryResolver } from './resolvers/queries/authentication'
import { getObjectsQueryResolver } from './resolvers/queries/get-objects'
import {
  sensorDataSubscribeResolver,
} from './resolvers/subscriptions/subscribe-to-sensor-data'
import { blockInputType, blockType } from './types/block'
import { measureType } from './types/measure'
import { objectType } from './types/object'

export const queryType = g.type('Query', {
  authentication: g.string()
    .args({
      email: g.string(),
      password: g.string(),
    }),
  objects: g.ref(() => objectType).list()
    .description('Get all objects'),
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
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    objects: getObjectsQueryResolver,
    authentication: loginQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
    modifyPassword: modifyPasswordMutationResolver,
  },
  Subscription: {
    sensorData: sensorDataSubscribeResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
