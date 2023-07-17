import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bcrypt from 'bcryptjs'
import {
  PgTable, ForeignKey, AnyPgColumn, PgNumeric, AnyPgTable, PgSerial,
} from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { createInsertSchema } from 'drizzle-zod'
import postgres from 'postgres'
import { z } from 'zod'
import { createFixture, Customization } from 'zod-fixture'

import {
  POSTGRES_DB, databaseConnectionString,
} from '../src/db/get-database-connection-string'
import * as schemas from '../src/db/schema'

// Drizzle Symbols
const originalNameSymbol = Symbol.for('drizzle:OriginalName')
const inlineForeignKeysSymbol = Symbol.for('drizzle:PgInlineForeignKeys')
const columnsSymbol = Symbol.for('drizzle:Columns')

const USER_PASSWORD = 'password'

// idMapping is used to keep track of the ids that are generated for foreign
// keys. This is needed because the foreign keys are generated in a separate
// step from the rest of the data.
const idMapping = new Map<string, number>()

async function seed(
  repeat: number,
  reset = false,
) {
  if (reset) {
    await resetDatabase()
  }

  // Need to import this after resetDatabase() because it will drop the database
  // and so existing connections will be broken. Importing this after
  // resetDatabase() will ensure that the connection is created after the
  // database is reset.
  const { database } = await import('../src/db')

  for (let index = 0; index < repeat; index++) {
    for (const schema of Object.values(schemas)) {
      if (!(schema instanceof PgTable)) {
        continue
      }

      await generateMock(database, schema)
    }
  }
}

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

async function generateMock(
  database: PostgresJsDatabase<typeof schemas>,
  schema: AnyPgTable,
) {
  const name = getOriginalName(schema)
  const foreignKeyNames = await getForeignKeyNames(database, schema)
  const columns = getColumns(schema)
  const primaryColumns = Object.fromEntries(
    Object.entries(columns).filter(([, column]) => column instanceof PgSerial),
  )

  const schemaGeneratorRefinements = Object.fromEntries(
    getSchemaGeneratorRefinementEntries(columns),
  )
  const insertSchema = createInsertSchema(schema, schemaGeneratorRefinements)

  const mock = createFixture(insertSchema, {
    customizations: [
      getForeignKeyZodFixtureCustomization(foreignKeyNames),
      getIdZodFixtureCustomization(),
      getPasswordZodFixtureCustomization(),
      getEmailZodFixtureCustomization(),
      getIconNameZodFixtureCustomization(),
      getLocationZodFixtureCustomization(),
      getMapZodFixtureCustomization(),
      getConfigZodFixtureCustomization(),
    ],
  })

  const cleanedMock = Object.fromEntries(
    Object.entries(mock).filter(([key]) => !(key in primaryColumns)),
  )

  const [values] = await database.insert(schema).values(cleanedMock).returning()

  if (values) {
    for (const [key, value] of Object.entries(values)) {
      if (typeof value !== 'number') {
        continue
      }

      if (key in primaryColumns) {
        idMapping.set(normalizeName(key), value)
      }
    }

    if (name === 'Users') {
      console.log(
        'Created user (' +
        `id=${values.userId}, ` +
        `name=${values.name}, ` +
        `email=${values.email}, ` +
        `password=${USER_PASSWORD})`,
      )
    }
  }

  return values
}

async function getForeignKeyNames(
  database: PostgresJsDatabase<typeof schemas>,
  schema: AnyPgTable,
): Promise<string[]> {
  const foreignKeyNames = <string[]>[]

  for (const foreignKey of getForeignKeys(schema)) {
    const reference = foreignKey.reference()
    const schemaName = getOriginalName(reference.foreignTable)

    // eslint-disable-next-line import/namespace
    const referenceSchema = schemas[schemaName as keyof typeof schemas]

    if (
      referenceSchema === undefined ||
      !(referenceSchema instanceof PgTable)
    ) {
      continue
    }

    const mock = await generateMock(database, referenceSchema)

    for (const column of reference.foreignColumns) {
      foreignKeyNames.push(column.name)

      if (mock === undefined) {
        continue
      }

      const foreignEntry = Object.entries(mock).find(([key]) =>
        normalizeName(key) === normalizeName(column.name))

      if (foreignEntry === undefined) {
        throw new Error(`Foreign entry for ${column.name} is undefined`)
      }

      const foreignKeyName = foreignEntry[0]
      const foreignKeyValue = foreignEntry[1]

      if (typeof foreignKeyValue !== 'number') {
        throw new TypeError('Does not support non-number primary keys')
      }
    }
  }

  return foreignKeyNames
}

function getForeignKeys(schema: AnyPgTable): ForeignKey[] {
  return (schema as any)[inlineForeignKeysSymbol]
}

function getOriginalName(schema: AnyPgTable): string {
  return (schema as any)[originalNameSymbol]
}

function normalizeName(name: string): string {
  return name.replaceAll('_', '').toLowerCase()
}

function getColumns(schema: AnyPgTable): Record<string, AnyPgColumn> {
  return (schema as any)[columnsSymbol]
}

function* getSchemaGeneratorRefinementEntries(
  columns: Record<string, AnyPgColumn>,
) {
  const schemaGeneratorRefinements = [
    [PgNumeric, z.number()],
  ] as const

  for (const [type, refinement] of schemaGeneratorRefinements) {
    for (const [name, column] of Object.entries(columns)) {
      if (column instanceof type) {
        yield [name, refinement] as const
      }
    }
  }
}

function getForeignKeyZodFixtureCustomization(
  foreignKeyNames: string[],
): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        foreignKeyNames.some((name) =>
          normalizeName(name) === normalizeName(propertName))
      )
    },
    generator({ propertName }) {
      if (propertName === undefined) {
        throw new Error('propertName is undefined')
      }

      const id = [...idMapping.entries()].find(([key]) => {
        return normalizeName(key) === normalizeName(propertName)
      })?.[1]

      if (id === undefined) {
        throw new Error(`id for ${propertName} is undefined`)
      }

      return id
    },
  }
}

function getIdZodFixtureCustomization(): Customization {
  return {
    condition: ({ type, propertName }) => {
      return (
        type === 'number' &&
        (propertName?.toLowerCase().endsWith('id') ?? false)
      )
    },
    generator({ propertName }) {
      if (propertName === undefined) {
        throw new Error('propertName is undefined')
      }

      const id = idMapping.get(propertName) ?? 1
      return id
    },
  }
}

function getIconNameZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'iconname'
      )
    },
    generator() {
      return 'diamond'
    },
  }
}

function getLocationZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'location'
      )
    },
    generator() {
      return [0, 0]
    },
  }
}

function getMapZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'map'
      )
    },
    generator() {
      return Buffer.from('')
    },
  }
}

function getConfigZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'config'
      )
    },
    generator() {
      return {}
    },
  }
}

function getPasswordZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'password'
      )
    },
    generator() {
      return bcrypt.hashSync(USER_PASSWORD, 10)
    },
  }
}

function getEmailZodFixtureCustomization(): Customization {
  return {
    condition: ({ propertName }) => {
      return (
        propertName !== undefined &&
        normalizeName(propertName) === 'email'
      )
    },
    generator() {
      const randomString = Math.random().toString(36).slice(7)
      return `${randomString}@email.com`
    },
  }
}

const nodePath = path.resolve(process.argv[1] ?? '')
const modulePath = path.resolve(fileURLToPath(import.meta.url))
const isRunningDirectlyViaCLI = nodePath === modulePath

await seed(
  10,
  process.argv.includes('--reset'),
)
  .then(() => {
    if (isRunningDirectlyViaCLI) {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    }
  })
