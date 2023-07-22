import { g } from 'garph'

export const buffer = g.scalarType<
  Buffer | { base64: string },
  { base64: string }
>(
  'Buffer',
  {
    serialize: (value) => {
      if (value instanceof Buffer) {
        return { base64: value.toString() }
      }

      return value
    },
    parseValue: (value) => value,
  },
)
