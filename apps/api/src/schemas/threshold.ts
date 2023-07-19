import { g } from 'garph'

import { objectType } from './object'
import { thresholdTriggerType } from './threshold-trigger'

export const thresholdType = g.type('Threshold', {
  thresholdId: g.int(),
  minimum: g.float(),
  maximum: g.float(),
  triggers: g.ref(() => thresholdTriggerType).list()
    .omitResolver(),
  sensor: g.ref(() => objectType)
    .omitResolver(),
})
