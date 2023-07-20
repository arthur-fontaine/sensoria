import { g } from 'garph'

export const roleType = g.type('Role', {
  roleId: g.int(),
  name: g.string(),
  permissions: g.string().list(),
})

