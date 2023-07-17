import { g } from 'garph'

import { objectType } from './object'

export const triggerType = g.type('Trigger', {
  newState: g.boolean(),
  object: g.ref(() => objectType),
})
