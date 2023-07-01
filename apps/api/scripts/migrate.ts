import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import {
  databaseConnectionString,
} from '../src/db/get-database-connection-string'

dotenv.config()

const migrationsClient = postgres(databaseConnectionString, {
  max: 1,
})

const nodePath = path.resolve(process.argv[1] ?? '')
const modulePath = path.resolve(fileURLToPath(import.meta.url))
const isRunningDirectlyViaCLI = nodePath === modulePath

const database = drizzle(migrationsClient)
await migrate(database, { migrationsFolder: './drizzle' })
  .then(() => {
    if (isRunningDirectlyViaCLI) {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    }
  })
