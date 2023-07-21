import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { objects } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type EditObjectMutationResolver = ResolverFunction<NonNullable<
  Resolvers['Mutation']['editObject']
>>

export const editObjectMutationResolver: EditObjectMutationResolver = (
  (_parent, args, _context, _info) => {
    return editObject(args)
  }
)

function editObject(args: {
  object: {
    objectId: number
    name?: string
    emplacement?: [number, number] | null | undefined
  }
}) {
  return database
    .update(objects)
    .set({
      ...(args.object.name !== undefined && {
        name: args.object.name,
      }),
      ...(args.object.emplacement !== undefined && {
        emplacement: args.object.emplacement,
      }),
    })
    .where(eq(objects.objectId, args.object.objectId))
    .returning()
    .then(([updatedObject]) => {
      if (updatedObject === undefined) {
        throw new Error('Object not updated')
      }

      return updatedObject
    })
}
