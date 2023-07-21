import bcrypt from 'bcryptjs'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { users, roles } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type addUserMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['addUser']>>
)

function generateRandomPassword(length: number): string {
  const charset = 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let index = 0; index < length; index++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

export const addUserMutationResolver: addUserMutationResolver =
  async (_parent, args) => {
    await addUser(args.name, args.email)
    return true
  }

async function addUser(
  name: string,
  email: string,
) {

  if (name === undefined || name === null) {
    throw new Error('name not exist')
  }

  if (email === undefined || email === null) {
    throw new Error('email not exist')
  }

  const password = generateRandomPassword(10)

  const hashedPassword = await bcrypt.hash(password, 10)

  await database.insert(roles).values({
    roleId: -1,
    name: 'default',
  }).onConflictDoNothing({
    target: [roles.roleId],
  }).execute()

  await database.insert(users).values({
    email,
    name,
    password: hashedPassword,
    roleId: -1,
  })

}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
