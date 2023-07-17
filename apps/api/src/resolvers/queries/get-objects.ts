import { SQL, isNull, or } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { objects } from '../../db/schema'

type CreateBlockMutationResolver = NonNullable<
  Resolvers['Query']['objects']
>

export const getObjectsQueryResolver: CreateBlockMutationResolver = (
  (_parent, _args, _context, _info) => {
    return getObjects()
  }
)

async function getObjects() {
  return database
    .select({
      objectId: objects.objectId,
      name: objects.name,
      iconName: objects.iconName,
      installationDate: objects.installationDate,
      isAvailable: or(
        isNull(objects.installationDate),
        isNull(objects.emplacement),
        isNull(objects.hallId),
      ) as SQL<boolean>,
    })
    .from(objects)
}
