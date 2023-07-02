import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { Users } from '../../db/schema'

export const modifyPasswordMutationResolver: NonNullable<
  Resolvers['Mutation']['modifyPassword']
> = async (_parent, args) => {
  await modifyPassword(args.email, args.password, args.newPassword)
  return true
}

async function modifyPassword(
  email: string,
  password: string,
  newPassword: string,
) {
  const userPassword = await database
    .select({ password: Users.password })
    .from(Users)
    .where(eq(Users.email, email))
    .then(([user]) => user?.password)

  if (userPassword === undefined || userPassword === null ) {
    throw new Error('User not found')
  }

  const validPassword = bcrypt.compare(password, userPassword)

  if (!validPassword) {
    throw new Error('Invalid password')
  }

  await database
    .update(Users)
    .set({password : await bcrypt.hash(newPassword, 10)})
    .where(eq(Users.email, email))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
