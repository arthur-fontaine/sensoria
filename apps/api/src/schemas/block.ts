import { g } from 'garph'

import { hallInputType, hallType } from './hall'
import { coordinates } from './scalar/coordinates'

export const blockType = g.type('Block', {
  blockId: g.int().description('The block ID'),
  name: g.string().description('The block name'),
  location: g.ref(() => coordinates).description('The block location'),
  halls: g.ref(() => hallType).list()
    .omitResolver()
    .description('The block hall'),
})

export const blockInputType = g.inputType('BlockInput', {
  name: g.string().description('The block name'),
  location: g.ref(() => coordinates).description('The block location'),
  halls: g.ref(() => hallInputType).list().description('The block hall'),
})
