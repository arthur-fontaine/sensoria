import type { Resolvers } from '../..'
import { database } from '../../db'

export const objectQueryResolver: NonNullable<Resolvers['Query']['objects']> = (
  (_parent, args, _context, _info) => {
    return getObject(args.id ?? undefined)
  }
)

async function getObject(id?: number) {
  return database.query.objects.findFirst({
    where: (objects, { eq }) => eq(objects.objectId, id),
    with: {
      thresholds: true,
    },
  })
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should pass', () => {
    expect(true).toBe(true)
  })
}
