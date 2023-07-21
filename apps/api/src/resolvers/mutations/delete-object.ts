import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { objects } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type DeleteObjectMutationResolver = ResolverFunction<NonNullable<
  Resolvers['Mutation']['deleteObject']
>>

export const deleteObjectMutationResolver: DeleteObjectMutationResolver = (
  async (_parent, args, _context, _info) => {
    await deleteObject(args)

    return true
  }
)

function deleteObject(args: {
  id: number
}) {
  return database.delete(objects)
    .where(eq(objects.objectId, args.id))
}
