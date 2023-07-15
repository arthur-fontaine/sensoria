import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { createBlockMutationResolver } from './resolvers/mutations/create-block'
import { getObjectsQueryResolver } from './resolvers/queries/get-objects'
import { blockInputType, blockType } from './types/block'
import { objectType } from './types/object'

export const queryType = g.type('Query', {
  objects: g.ref(() => objectType).list()
    .description('Get all objects'),
})

export const mutationType = g.type('Mutation', {
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
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    objects: getObjectsQueryResolver,
  },
  Mutation: {
    createBlock: createBlockMutationResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
