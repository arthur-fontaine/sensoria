import type { Resolvers } from '../..'
import { database } from '../../db'
import { roles } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type addRoleMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['addRole']>>
)

export const addUserMutationResolver: addRoleMutationResolver =
  async (_parent, args) => {
    await addRole(args.name, args.permissions)
    return true
  }

async function addRole(
  name: string,
  permissions: [],
) {
  await database.insert(roles).values({
    name, permissions,
  })

}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
