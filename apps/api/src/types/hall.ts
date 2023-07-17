import { g } from 'garph'

import { objectInputType } from './object'
import { blob } from './scalar/blob'

export const hallType = g.type('Hall', {
  hallId: g.int().description('The hall ID'),
  blockId: g.int().description('The block ID'),
  hallTagId: g.int().optional().description('The hall tag ID'),
  label: g.string().description('The hall label'),
  map: g.ref(blob).description('The hall map'),
})

export const hallInputType = g.inputType('HallInput', {
  label: g.string().description('The hall label'),
  map: g.ref(blob).description('The hall map'),
  objects: g.ref(() => objectInputType).list().description('The hall objects'),
})
