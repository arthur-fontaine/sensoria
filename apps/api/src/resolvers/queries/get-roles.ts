import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetRolesMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['roles']>>
)

export const getRolesQueryResolver: GetRolesMutationResolver = (
  () => {
    return getRoles()
  }
)

function getRoles() {
  return database.query.roles.findMany({})
    .then((roles) => {
      return roles.map((role) => ({
        ...role,
      }))
    })
}
