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

type LoginQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['authentication']>>
)

export const loginQueryResolver: LoginQueryResolver = (
  (_parent, args) => {
    return authentication(args.email, args.password)
  }
)

async function authentication(email: string, password: string) {
  const { userPassword, userId } = await database
    .select({ password: users.password, id: users.userId })
    .from(users)
    .where(eq(users.email, email))
    .then(([user]) => ({
      userPassword: user?.password,
      userId: user?.id,
    }))

  if (userPassword === undefined || userPassword === null) {
    throw new Error('User not found')
  }

  const validPassword = await bcrypt.compare(password, userPassword)

  if (!validPassword) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userEmail: email, userId }, JWT_SECRET)

  return token
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
