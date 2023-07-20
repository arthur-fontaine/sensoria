import { g } from 'garph'

export const blob = g.scalarType<Blob | { base64: string }, Blob>(
  'Blob',
  {
    serialize: (value) => {
      if (value instanceof Blob) {
        return value
      }

      return new Blob([value.base64])
    },
    parseValue: (value) => value,
  },
)
