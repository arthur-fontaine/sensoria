import path from 'node:path'
import { fileURLToPath } from 'node:url'

import postgres from 'postgres'

import {
  databaseConnectionString, POSTGRES_DB,
} from '../src/db/get-database-connection-string'

async function resetDatabase() {
  // We need to connect to the postgres database because we can't drop the
  // database that we are currently connected to.
  const client = postgres(
    `${databaseConnectionString.split('/').slice(0, -1).join('/')}/postgres`,
  )

  await client.unsafe(`DROP DATABASE IF EXISTS ${POSTGRES_DB} WITH (FORCE);`)
  await client.unsafe(`CREATE DATABASE ${POSTGRES_DB};`)

  // We re-run the migrations after resetting the database because the
  // migrations will create the tables and constraints.
  await import('./migrate')
}

const nodePath = path.resolve(process.argv[1] ?? '')
const modulePath = path.resolve(fileURLToPath(import.meta.url))
const isRunningDirectlyViaCLI = nodePath === modulePath

await resetDatabase()
  .then(() => {
    if (isRunningDirectlyViaCLI) {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    }
  })
