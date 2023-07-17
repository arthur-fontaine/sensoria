import { g } from 'garph'

import { measureType } from './measure'
import { coordinates } from './scalar/coordinates'
import { tagType } from './tag'
import { thresholdType } from './threshold'

export const objectType = g.type('Object', {
  objectId: g.int().description('The object id'),
  name: g.string().description('The object name'),
  description: g.string().description('The object description'),
  iconName: g.string().optional().description('The object icon name'),
  emplacement: g.ref(() => coordinates).optional()
    .description('The object emplacement'),
  isAvailable: g.boolean().description('The object availability'),
  lastMeasure: g.ref(() => measureType).optional(),
  batteryLevel: g.float().description('The object battery level'),
  tags: g.ref(() => tagType).list().description('The object tags'),
  thresholds: g.ref(() => thresholdType).list()
    .description('The object thresholds'),
})

export const objectInputType = g.inputType('ObjectInput', {
  objectId: g.int().description('The object id'),
  emplacement: g.ref(() => coordinates)
    .description('The object emplacement'),
})
