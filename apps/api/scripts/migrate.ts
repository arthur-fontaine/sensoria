import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

dotenv.config()

const connectionString = `postgres://${
  process.env.POSTGRES_USER}:${
  process.env.POSTGRES_PASSWORD}@0.0.0.0:${
  process.env.POSTGRES_PORT}/${
  process.env.POSTGRES_DB}`

const migrationsClient = postgres(connectionString, {
  max: 1,
})

const database = drizzle(migrationsClient)
await migrate(database, { migrationsFolder: './drizzle' })
  .then(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0)
  })
