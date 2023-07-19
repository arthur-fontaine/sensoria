import dotenv from 'dotenv'

dotenv.config()

let POSTGRES_USER: string | undefined = ''
let POSTGRES_PASSWORD: string | undefined = ''
let POSTGRES_PORT: string | undefined = ''
let POSTGRES_DB: string | undefined = ''

if (typeof window === 'undefined') {
  POSTGRES_USER = process.env.POSTGRES_USER
  POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
  POSTGRES_PORT = process.env.POSTGRES_PORT
  POSTGRES_DB = process.env.POSTGRES_DB

  if (POSTGRES_USER === undefined) {
    throw new Error('POSTGRES_USER is not defined')
  }

  if (POSTGRES_PASSWORD === undefined) {
    throw new Error('POSTGRES_PASSWORD is not defined')
  }

  if (POSTGRES_PORT === undefined) {
    throw new Error('POSTGRES_PORT is not defined')
  }

  if (POSTGRES_DB === undefined) {
    throw new Error('POSTGRES_DB is not defined')
  }
}

// Have to use "import.meta['vitest']" instead of "import dot meta dot vitest"
// to prevent Vitest from trying to run this file as a test.
// eslint-disable-next-line max-len
// See https://github.com/vitest-dev/vitest/blob/d77f712f480be18407f5c089eee7bcb95bcd0964/packages/vitest/src/node/workspace.ts#L149
if (import.meta['vitest'] || process.env.NODE_ENV === 'test') {
  POSTGRES_DB = `${POSTGRES_DB}_test`
}

export const databaseConnectionString = `postgres://${
  POSTGRES_USER}:${
  POSTGRES_PASSWORD}@0.0.0.0:${
  POSTGRES_PORT}/${
  POSTGRES_DB}`

export {
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
}
