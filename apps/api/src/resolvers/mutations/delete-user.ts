import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { users } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type DeleteUserMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['deleteUser']>>
)

export const deleteUserMutationResolver: DeleteUserMutationResolver =
  async (_parent, args) => {
    await deleteUser(args.userId)
    return true
  }

async function deleteUser(userId: number) {
  const user = await database
    .select({ userId: users.userId })
    .from(users)
    .where(eq(users.userId, userId))
    .then(([user]) => user)

  if (!user) {
    throw new Error('User not found')
  }

  await database
    .delete(users)
    .where(eq(users.userId, userId))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
