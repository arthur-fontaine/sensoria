import { g } from 'garph'

export const buffer = g.scalarType<Buffer | { base64: string }, Buffer>(
  'Buffer',
  {
    serialize: (value) => {
      if (value instanceof Buffer) {
        return value
      }

      return Buffer.from(value.base64, 'base64')
    },
    parseValue: (value) => value,
  },
)
