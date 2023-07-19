import { createRouter } from '@swan-io/chicane'

export const Router = createRouter({
  Login: '/login',
  Updatepassword: '/updatepassword',
  Onboarding: '/onboarding/:step',
  Dashboard: '/dashboard',
  Users: '/users',
  Tag: '/tags/:tagId',
})
