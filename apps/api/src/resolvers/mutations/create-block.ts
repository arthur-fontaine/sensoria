import crypto from 'node:crypto'

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import {
  blocks, halls, objects, roles,
  users, usersToAccesses,
} from '../../db/schema'
import type { ResolverFunction } from '../../types/resolver-functions'

type CreateBlockMutationResolver = ResolverFunction<NonNullable<
  Resolvers['Mutation']['createBlock']
>>

export const createBlockMutationResolver: CreateBlockMutationResolver = (
  (_parent, args, _context, _info) => {
    return createBlock({
      name: args.block.name,
      location: args.block.location,
      halls: args.block.halls,
      email: args.email,
    })
  }
)

async function createBlock(
  args: {
    name: string,
    location: [number, number],
    halls: {
      map: Buffer | { base64: string }
      label: string
      objects: {
        objectId: number,
        emplacement?: [number, number] | null | undefined
      }[]
    }[],
    email: string,
  },
) {
  return database.transaction(async (tx) => {
    const {
      createdBlockId,
      createdBlockName,
      createBlockLocation,
    } = await tx
      .insert(blocks)
      .values({
        name: args.name,
        location: args.location,
      })
      .returning({
        blockId: blocks.blockId,
        name: blocks.name,
        location: blocks.location,
      })
      .then(([createdBlock]) => {
        if (createdBlock === undefined) {
          throw new Error('Block not created')
        }

        return {
          createdBlockId: createdBlock.blockId,
          createdBlockName: createdBlock.name,
          createBlockLocation: createdBlock.location,
        }
      })

    const createdHalls = await tx.transaction(async (tx2) => {
      const createdHalls: {
        hallId: number
        blockId: number
        label: string
        map: Buffer
        objects: {
          objectId: number
          name: string
          emplacement: [number, number]
        }[]
      }[] = []

      for (const { map, label, objects: hallObjects } of args.halls) {
        // installationDate, emplacement, or hallId are null

        const [createdHall] = await tx2
          .insert(halls)
          .values({
            blockId: createdBlockId,
            label,

            // using Buffer.from(map.base64, 'base64url') doesn't work
            map: map instanceof Buffer
              ? map
              : Buffer.from(map.base64),
          })
          .returning({
            hallId: halls.hallId,
            blockId: halls.blockId,
            label: halls.label,
            map: halls.map,
          })

        if (createdHall === undefined) {
          console.error('Hall not created')
          continue
        }

        const updatedObjects = await tx2.transaction(async (tx3) => {
          const updatedObjects: {
            objectId: number
            name: string
            emplacement: [number, number]
          }[] = []

          for (const { objectId, emplacement } of hallObjects) {
            if (emplacement === undefined) {
              console.error('Object emplacement is undefined')
              continue
            }

            const updatedObjects = await tx3
              .update(objects)
              .set({
                hallId: createdHall.hallId,
                emplacement,
                installationDate: new Date(),
              })
              .where(eq(objects.objectId, objectId))
              .returning({
                objectId: objects.objectId,
                emplacement: objects.emplacement,
              })

            if (updatedObjects.length !== 1) {
              console.error('Object not updated')
              continue
            }

            const updatedObject = updatedObjects[0]

            if (updatedObject === undefined) {
              console.error('Object not updated')
              continue
            }

            if (updatedObject.emplacement === null) {
              console.error('Object emplacement is null')
              continue
            }

            updatedObjects.push(updatedObject)
          }

          return updatedObjects
        })

        createdHalls.push(
          ...createdHall === undefined ? [] : [{
            ...createdHall,
            objects: updatedObjects,
          }],
        )
      }

      return createdHalls
    })

    await createUser(tx, args.email, createdHalls.map((hall) => hall.hallId))

    return {
      blockId: createdBlockId,
      name: createdBlockName,
      halls: createdHalls,
      location: createBlockLocation,
    }
  })
}

// https://stackoverflow.com/a/51540480
function generatePassword(
  length = 20,
  // eslint-disable-next-line max-len
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
) {
  return [...crypto.randomFillSync(new Uint32Array(length))]
    .map((x) => wishlist[x % wishlist.length])
    .join('')
}

type Tx = Parameters<Parameters<typeof database.transaction>[0]>[0]

async function createUser(tx: Tx, email: string, hallIds: number[]) {
  const password = generatePassword()

  await database
    .insert(roles)
    .values({
      roleId: -1,
    })
    .onConflictDoNothing({
      target: [roles.roleId],
    })
    .execute()

  const { userId } = await tx
    .insert(users)
    .values({
      email,
      name: email,
      password: bcrypt.hashSync(password, 10),
      roleId: -1,
    })
    .returning({
      userId: users.userId,
    })
    .execute()
    .then(([user]) => {
      if (user === undefined) {
        throw new Error('User not created')
      }

      return user
    })

  for (const hallId of hallIds) {
    await tx
      .insert(usersToAccesses)
      .values({
        userId,
        hallId,
        haveAccess: true,
      })
      .execute()
  }

  // TODO: send email
  console.info(`Created user ${email} with password ${password}`)
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should create a block', async () => {
    expect(true).toBe(true)
  })
}
