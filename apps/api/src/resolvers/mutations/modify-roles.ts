import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { users, roles } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type ModifyRoledMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['modifyRole']>>
)

export const modifyRoleMutationResolver: ModifyRoledMutationResolver =
  async (_parent, args) => {
    await modifyRole(args.userId, args.newRole)
    return true
  }

async function modifyRole(
  userId: number,
  newRole: string,
) {

  const user = await database
    .select({ userId: users.userId })
    .from(users)
    .where(eq(users.userId, userId))
    .then(([user]) => user)

  if (!user) {
    throw new Error('User not found')
  }

  const role = await database
    .select({ roleId: roles.roleId})
    .from(roles)
    .where(eq(roles.name, newRole))
    .then(([role]) => role)

  if (!role) {
    throw new Error('Role not found')
  }

  await database
    .update(users)
    .set({ roleId: role.roleId })
    .where(eq(users.userId, userId))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
