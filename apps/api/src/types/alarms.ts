import { g } from 'garph'

import { dateType } from './scalar/date'

export const alarmsType = g.type('Alarms', {
  alertId: g.int(),
  sensorId: g.int(),
  impact: g.enumType('impact', ['high', 'medium', 'normal', 'post_high']),
  timestamp: g.ref(() => dateType),
})
