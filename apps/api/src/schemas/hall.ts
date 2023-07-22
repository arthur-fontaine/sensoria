import { g } from 'garph'

import { blockType } from './block'
import { objectInputType, objectType } from './object'
import { buffer } from './scalar/buffer'

export const hallType = g.type('Hall', {
  hallId: g.int().description('The hall ID'),
  blockId: g.int().description('The block ID'),
  hallTagId: g.int().optional().description('The hall tag ID'), // TODO
  label: g.string().description('The hall label'),
  map: g.ref(buffer).description('The hall map'),
  block: g.ref(() => blockType).omitResolver().description('The block'),
  objects: g.ref(() => objectType).list()
    .omitResolver()
    .description('The hall objects'),
})

export const hallInputType = g.inputType('HallInput', {
  label: g.string().description('The hall label'),
  map: g.ref(buffer).description('The hall map'),
  objects: g.ref(() => objectInputType).list().description('The hall objects'),
})
