import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { databaseConnectionString } from './get-database-connection-string'
import * as schema from './schema'

export const client = postgres(databaseConnectionString)
export const database = drizzle(client, { schema })
