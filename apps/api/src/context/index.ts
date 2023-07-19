import dotenv from 'dotenv'
import type { YogaInitialContext } from 'graphql-yoga'
import jwt from 'jsonwebtoken'

dotenv.config()

if (process.env.JWT_SECRET === undefined) {
  throw new Error('JWT_SECRET is undefined')
}

const JWT_SECRET = process.env.JWT_SECRET

export async function createContext(initialContext: YogaInitialContext) {
  const header = initialContext.request.headers.get('authorization')

  let userId: number | undefined
  if (header !== null) {
    const token = header.split(' ')[1]

    if (token === undefined) {
      throw new Error('No authorization provided.')
    }

    const tokenPayload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    userId = tokenPayload.userId

    if (userId === undefined || typeof userId !== 'number') {
      throw new Error('Invalid token')
    }
  }

  return {
    ...initialContext,
    userId,
  }
}

export type Context = ReturnType<typeof createContext>
