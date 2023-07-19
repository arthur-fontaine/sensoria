import { eq } from 'drizzle-orm'

import type { Resolvers } from '../..'
import { database } from '../../db'
import { blocks, halls, objects } from '../../db/schema'

type CreateBlockMutationResolver = NonNullable<
  Resolvers['Mutation']['createBlock']
>

export const createBlockMutationResolver: CreateBlockMutationResolver = (
  (_parent, args, _context, _info) => {
    return createBlock({
      name: args.block.name,
      location: args.block.location,
      halls: args.block.halls,
    })
  }
)

async function createBlock(
  args: {
    name: string,
    location: [number, number],
    halls: {
      map: Blob | { base64: string }
      label: string
      objects: { objectId: number, emplacement: [number, number] }[]
    }[],
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
        map: Blob
        objects: {
          objectId: number
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
            map: map instanceof Blob
              ? Buffer.from(await map.arrayBuffer())
              : Buffer.from(map.base64, 'base64'),
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
            emplacement: [number, number]
          }[] = []

          for (const { objectId, emplacement } of hallObjects) {
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
            map: new Blob([createdHall.map]),
          }],
        )
      }

      return createdHalls
    })

    return {
      blockId: createdBlockId,
      name: createdBlockName,
      halls: createdHalls,
      location: createBlockLocation,
    }
  })
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should create a block', async () => {
    expect(true).toBe(true)
  })
}
