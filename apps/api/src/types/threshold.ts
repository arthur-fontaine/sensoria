import { g } from 'garph'

import { objectType } from './object'
import { triggerType } from './trigger'

export const thresholdType = g.type('Threshold', {
  thresholdId: g.int(),
  minimum: g.float(),
  maximum: g.float(),
  triggers: g.ref(g.type('ThresholdTrigger', {
    on: g.string(),
    trigger: g.ref(() => triggerType),
  })).list(),
  sensor: g.ref(() => objectType),
})
