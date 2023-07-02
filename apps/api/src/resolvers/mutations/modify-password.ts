import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { Users } from '../../db/schema'

let JWT_SECRET = ''

if (typeof window === 'undefined') {
  dotenv.config()
  
  if (process.env.JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET is undefined')
  }
  
  JWT_SECRET = process.env.JWT_SECRET
}

export const modifyPasswordMutationResolver: NonNullable<
  Resolvers['Mutation']['modifyPassword']
> = async (_parent, args) => {
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
    .select({ password: Users.password, id: Users.userId })
    .from(Users)
    .where(eq(Users.email, email))
    .then(([user]) => ({
      userPassword: user?.password,
    }))

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
