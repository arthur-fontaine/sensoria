import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetObjectsFromHallQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Hall']['objects']>>
)

export const getObjectsFromHallQueryResolver:
  GetObjectsFromHallQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.objects
        .findMany({
          where: (objects, { eq }) => eq(objects.hallId, parent.hallId),
        })
    }
  )
