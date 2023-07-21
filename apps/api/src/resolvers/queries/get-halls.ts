import type { Resolvers } from '../..'
import { database } from '../../db'
import type { ResolverFunction } from '../../types/resolver-functions'

type GetHallsQueryResolver = (
    ResolverFunction<NonNullable<Resolvers['Query']['halls']>>
)

export const getHallsQueryResolver: GetHallsQueryResolver = (
    (_parent, _args, _context, _info) => {
        return database.query.halls.findMany()
            .then(halls => (
                halls.map(hall => ({
                    ...hall, 
                    map: { base64: hall.map.toString("base64url") }
                }))
            ))
    })