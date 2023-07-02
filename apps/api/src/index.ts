import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { 
  modifyPasswordMutationResolver,
} from './resolvers/mutations/modify-password'
import { loginQueryResolver } from './resolvers/queries/authentication'

export const queryType = g.type('Query', {
  authentication: g.string()
    .args({
      email:g.string(),
      password:g.string(),
    }),
})

export const mutationType = g.type('Mutation', {
  modifyPassword: g.boolean()
    .args({
      email:g.string(),
      password:g.string(),
      newPassword:g.string(),
    }),
})

export type Resolvers = InferResolvers<{
  Query: typeof queryType,
  Mutation: typeof mutationType,
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    authentication: loginQueryResolver,
  },
  Mutation: {
    modifyPassword: modifyPasswordMutationResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
