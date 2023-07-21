import { type InferClient, createClient } from '@garph/gqty'
import {
  createGeneratedSchema,
  createScalarsEnumsHash,
} from '@garph/gqty/dist/utils'
import { type mutationType, type queryType, schema } from '@sensoria/api'

type ClientTypes = InferClient<{
  query: typeof queryType
  mutation: typeof mutationType
}>

if (process.env.API_PORT == undefined) {
  throw new Error('API_PORT is not defined')
}

const API_PORT = Number.parseInt(process.env.API_PORT)

export const { useMutation, useQuery, resolve } = createClient<ClientTypes>({
  generatedSchema: createGeneratedSchema(schema),
  scalarsEnumsHash: createScalarsEnumsHash(schema),
  url: `http://localhost:${API_PORT}/graphql`,
  headers: {
    get Authorization() {
      const token = (
        localStorage.getItem('token') ?? sessionStorage.getItem('token')
      )

      if (token === null) {
        return ''
      }

      return `Bearer ${token}`
    },
  },
})

// Needed for the babel plugin
export { schema as compiledSchema } from '@sensoria/api'
