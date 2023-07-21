import { and, eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { blocks, halls, usersToAccesses } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetBlocksMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['blocks']>>
)

export const getBlocksQueryResolver: GetBlocksMutationResolver = (
  async (_parent, args, context, _info) => {
    if (context.userId === undefined) {
      throw new Error('Unauthorized')
    }

    return getBlocks(context.userId, args.id ?? undefined)
  }
)

async function getBlocks(userId: number, id?: number) {
  let query = database
    .selectDistinctOn([blocks.blockId], { blocks })
    .from(blocks)
    .leftJoin(halls, eq(halls.blockId, blocks.blockId))
    .leftJoin(usersToAccesses, eq(usersToAccesses.hallId, halls.hallId))
    .where(and(
      eq(usersToAccesses.userId, userId),
      eq(usersToAccesses.haveAccess, true),
    ))

  if (id !== undefined) {
    query = query.where(eq(blocks.blockId, id))
  }

  return query.then(rows =>
    rows.map(({ blocks }) => blocks))
}

type GetHallsFromBlockQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Block']['halls']>>
)

export const getHallsFromBlockQueryResolver: GetHallsFromBlockQueryResolver = (
  (parent, _args, _context, _info) => {
    return database.query.halls
      .findMany({
        where: (halls, { eq }) => eq(halls.blockId, parent.blockId),
      })
  }
)
