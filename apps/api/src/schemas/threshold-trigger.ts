import { g } from 'garph'

import { triggerType } from './trigger'

export const thresholdTriggerType = g.type('ThresholdTrigger', {
  on: g.string(),
  trigger: g.ref(() => triggerType),
})
