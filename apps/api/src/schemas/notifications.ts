import { g } from 'garph'

import { measureType } from './measure'

export const notificationsType = g.type('Notifications', {
  notificationId: g.int(),
  message: g.string(),
  timestamp: g.string(),
  importance: g.enumType('importance', [
    'high',
    'medium',
    'normal',
    'post_high',
  ]),
  measureId: g.int(),
  measure: g.ref(() => measureType)
    .omitResolver()
    .description('The measure of sensor'),
})
