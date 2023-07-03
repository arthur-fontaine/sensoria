import { type InferClient, createClient } from '@garph/gqty'
import {
  createGeneratedSchema,
  createScalarsEnumsHash,
} from '@garph/gqty/dist/utils'
import { type queryType, schema, mutationType } from '@sensoria/api'

type ClientTypes = InferClient<{ 
  query: typeof queryType
  mutation: typeof mutationType
 }>

if (process.env.API_PORT == undefined) {
  throw new Error('API_PORT is not defined')
}

const API_PORT = Number.parseInt(process.env.API_PORT)

export const  { 
  useQuery, 
  useMutation, 
  useSubscription, 
} =  createClient<ClientTypes>({
  generatedSchema: createGeneratedSchema(schema),
  scalarsEnumsHash: createScalarsEnumsHash(schema),
  url: `http://localhost:${API_PORT}/graphql`,
})

// Needed for the babel plugin
export { schema as compiledSchema } from '@sensoria/api'
