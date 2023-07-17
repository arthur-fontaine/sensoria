import { g } from 'garph'

import { coordinates } from './scalar/coordinates'

export const objectType = g.type('Object', {
  objectId: g.int().description('The object id'),
  name: g.string().description('The object name'),
  iconName: g.string().optional().description('The object icon name'),
  emplacement: g.ref(() => coordinates).optional()
    .description('The object emplacement'),
  isAvailable: g.boolean().description('The object availability'),
})

export const objectInputType = g.inputType('ObjectInput', {
  objectId: g.int().description('The object id'),
  emplacement: g.ref(() => coordinates)
    .description('The object emplacement'),
})
