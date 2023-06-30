import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { Access, Alarms, Halls, Sensors, UsersAccess } from '../../db/schema'

export const getAlarmsQueryResolver:
 NonNullable<Resolvers['Query']['getAlarms']> = (
   async (_parent, _args, contextPromise, _info) => {
     const context = await contextPromise

     if (context.userId === undefined) {
       throw new Error('User is not logged in')
     }

     return getAlarms(context.userId)
   }
 )

async function getAlarms(userId: number) {
  const alarms = await database
    .select()
    .from(Alarms)
    .leftJoin(Sensors, eq(Alarms.sensorId, Sensors.sensorId))
    .leftJoin(Halls, eq(Sensors.hallId, Halls.hallId))
    .rightJoin(Access, eq(Access.hallId, Halls.hallId))
    .rightJoin(UsersAccess, eq(UsersAccess.accessId, Access.accessId))
    .where(eq(UsersAccess.userAccessId, userId))
    .then((result) => 
      result.map(({ Alarms }) => Alarms)
        .filter((alert): alert is NonNullable<typeof alert> => alert !== null))

  return alarms
}
