import { createRouter } from '@swan-io/chicane'

export const Router = createRouter({
  Login: '/login',
  Updatepassword: '/updatepassword',
  Onboarding: '/onboarding/:step',
  Dashboard: '/dashboard',
  Users: '/users',
  Roles: '/roles',
  Tag: '/tags/:tagId',
})
