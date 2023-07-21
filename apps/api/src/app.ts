import { createServer } from 'node:http'

import { createYoga } from 'graphql-yoga'

import { realtimeAddMqttDataToDb } from './services/mqtt/realtime-add-mqtt-data-to-db'

import { schema } from '.'

const API_PORT = Number.parseInt(process.env.API_PORT || '4000')

const yoga = createYoga({ schema })

const apiServer = createServer(yoga as any)

apiServer.listen(API_PORT, () => {
  // console.info(`Server is running on http://localhost:${API_PORT}/graphql`)
})

realtimeAddMqttDataToDb()
