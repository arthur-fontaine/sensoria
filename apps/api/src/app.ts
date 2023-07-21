import { createServer } from 'node:http'

import { createYoga } from 'graphql-yoga'

import { createContext } from './context'

import { schema } from '.'

import './services/mqtt'

const API_PORT = Number.parseInt(process.env.API_PORT || '4000')

const yoga = createYoga({ schema, context: createContext })

const apiServer = createServer(yoga as any)

apiServer.listen(API_PORT, () => {
  console.info(`Server is running on http://localhost:${API_PORT}/graphql`)
})
