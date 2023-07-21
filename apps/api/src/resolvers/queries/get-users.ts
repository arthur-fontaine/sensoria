import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetUsersMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['users']>>
)

export const getUsersQueryResolver: GetUsersMutationResolver = (
  () => {
    return getUsers()
  }
)

function getUsers() {
  return database.query.users.findMany({})
    .then((users) => {
      return users.map((user) => ({
        ...user,
      }))
    })
}

type GetRoleFromUserQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['User']['role']>>
)

export const getRoleFromUserQueryResolver:
  GetRoleFromUserQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.users
        .findFirst({
          where: (user, { eq }) => eq(user.userId, parent.userId),
          with: {
            role: true,
          },
        })
        .then((user) => {
          if (user === undefined) {
            throw new Error('User not found')
          }

          return user.role
        })
    }
  )
