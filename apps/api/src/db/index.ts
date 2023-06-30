import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

dotenv.config()

const connectionString = `postgres://${
  process.env.POSTGRES_USER}:${
  process.env.POSTGRES_PASSWORD}@0.0.0.0:${
  process.env.POSTGRES_PORT}/${
  process.env.POSTGRES_DB}`

const client = postgres(connectionString)
export const database = drizzle(client)
