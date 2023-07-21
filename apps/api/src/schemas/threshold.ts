import { g } from 'garph'

import { objectType } from './object'
import { thresholdTriggerType } from './threshold-trigger'

export const thresholdType = g.type('Threshold', {
  thresholdId: g.int(),
  minimum: g.float().optional(),
  maximum: g.float().optional(),
  triggers: g.ref(() => thresholdTriggerType).list()
    .omitResolver(),
  sensor: g.ref(() => objectType)
    .omitResolver(),
})

export const thresholdInputType = g.inputType('ThresholdInput', {
  thresholdId: g.int(),
  minimum: g.float().optional(),
  maximum: g.float().optional(),
})
