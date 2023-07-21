import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetNotificationsMutationResolver = (
  ResolverFunction<NonNullable<Resolvers['Query']['notifications']>>
)

export const getNotificationsQueryResolver: GetNotificationsMutationResolver = (
  (_parent, _args, _context, _info) => {
    return getNotifications()
  }
)

function getNotifications() {
  return database.query.notifications.findMany({})
    .then((notifications) =>
      notifications.map((notification) => ({
        ...notification,
        timestamp: notification.timestamp.getTime().toString(),
      })))
}

type GetMeasureFromNotificationsQueryResolver = (
  ResolverFunction<NonNullable<Resolvers['Notifications']['measure']>>
)

export const getMeasureFromNotificationsQueryResolver:
  GetMeasureFromNotificationsQueryResolver = (
    (parent, _args, _context, _info) => {
      return database.query.measures
        .findFirst({
          where: (measure, { eq }) => eq(measure.measureId, parent.measureId),
        })
        .then((measure) => {
          if (measure === undefined) {
            throw new Error('Measure not found')
          }

          return {
            ...measure,
            value: Number(measure.value),
            timestamp: measure.timestamp.getTime().toString(),
          }
        })
    }
  )
