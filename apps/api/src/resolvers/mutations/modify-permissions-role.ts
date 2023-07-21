import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { users, roles } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type ModifyPermissionsRoledMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['modifyPermissionsRoles']>>
)

export const modifyRoleMutationResolver: 
ModifyPermissionsRoledMutationResolver =
  async (_parent, args) => {
    await modifyRole(args.roleId, args.permissions)
    return true
  }

async function modifyRole(
  roleId: number,
  permissions: [],
) {

  const role = await database
    .select({ roleId: roles.roleId })
    .from(roles)
    .where(eq(roles.roleId, roleId))
    .then(([role]) => role)

  if (!role) {
    throw new Error('Role not found')
  }

  await database
    .update(roles)
    .set({ permissions: permissions })
    .where(eq(roles.roleId, roleId))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
