import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { Users } from '../../db/schema'

dotenv.config()

if (process.env.JWT_SECRET === undefined) {
  throw new Error('JWT_SECRET is undefined')
}

const JWT_SECRET = process.env.JWT_SECRET

export const loginQueryResolver: NonNullable<
  Resolvers['Query']['authentication']
> = (_parent, args) => {
  return authentication(args.email, args.password)
}

async function authentication(email: string, password: string) {
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

  const token = jwt.sign({ userId: email }, JWT_SECRET)

  return token
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  //test
  it('should greet', () => {
    expect(true).toBe(true)
  })

}
