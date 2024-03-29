import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { users } from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

let JWT_SECRET = ''

if (typeof window === 'undefined') {
  dotenv.config()

  if (process.env.JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET is undefined')
  }

  JWT_SECRET = process.env.JWT_SECRET
}

type ModifyPasswordMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Mutation']['modifyPassword']>>
)

export const modifyPasswordMutationResolver: ModifyPasswordMutationResolver =
  async (_parent, args) => {
    await modifyPassword(args.token, args.password, args.newPassword)
    return true
  }

async function modifyPassword(
  token: string,
  password: string,
  newPassword: string,
) {
  const { userEmail: email } = jwt.verify(token, JWT_SECRET) as {
    userEmail: string
  }

  const { userPassword } = await database
    .select({ password: users.password, id: users.userId })
    .from(users)
    .where(eq(users.email, email))
    .then(([user]) => ({
      userPassword: user?.password,
    }))

  if (userPassword === undefined || userPassword === null) {
    throw new Error('User not found')
  }
  const validPassword = await bcrypt.compare(password, userPassword)

  if (!validPassword) {
    throw new Error('Invalid password')
  }

  await database
    .update(users)
    .set({ password: await bcrypt.hash(newPassword, 10) })
    .where(eq(users.email, email))
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
