import { type InferResolvers, buildSchema, g } from 'garph'
import type { YogaInitialContext } from 'graphql-yoga'

import { greetQueryResolver } from './resolvers/queries/greet'

export const queryType = g.type('Query', {
  greet: g.string()
    .args({
      name: g.string().optional().default('Martin'),
    })
    .description('Greets a person'),
})

export type Resolvers = InferResolvers<{
  Query: typeof queryType,
}, { context: YogaInitialContext }>

const resolvers: Resolvers = {
  Query: {
    greet: greetQueryResolver,
  },
}

export const schema = buildSchema({ g, resolvers })
