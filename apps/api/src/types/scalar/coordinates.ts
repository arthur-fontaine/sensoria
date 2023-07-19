import { g } from 'garph'

export const coordinates = g.scalarType<[number, number], [number, number]>(
  'Coordinates',
  {
    serialize: (value) => value,
    parseValue: (value) => {
      if (value.length !== 2) {
        throw new Error('Invalid coordinates')
      }

      return value as [number, number]
    },
  },
)
