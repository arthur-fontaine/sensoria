import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { loginQueryResolver } from './resolvers/queries/authentication'

export const queryType = g.type('Query', {
  authentication: g.string()
    .args({
      email:g.string(),
      password:g.string(),
    }),
    
})

export type Resolvers = InferResolvers<{
  Query: typeof queryType,
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    authentication: loginQueryResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
