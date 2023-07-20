import { g } from 'garph'

import { roleType } from './roles'

export const userType = g.type('User', {
  email: g.string(),
  password: g.string(),
  userId: g.int(),
  name: g.string(),
  blockId: g.int().optional(),
  joinedAt: g.string(),
  permissions: g.string().list(),
  invitationId: g.int().optional(),
  roleId: g.int(),
  role: g.ref(() => roleType)
    .omitResolver(),
})
