import { g } from 'garph'

import { measureType } from './measure'
import { coordinates } from './scalar/coordinates'
import { tagType } from './tag'
import { thresholdType } from './threshold'

export const objectType = g.type('Object', {
  objectId: g.int().description('The object id'),
  name: g.string().description('The object name'),
  description: g.string().optional()
    .description('The object description'),
  iconName: g.string().optional().description('The object icon name'),
  emplacement: g.ref(() => coordinates).optional()
    .description('The object emplacement'),
  isAvailable: g.boolean()
    .omitResolver()
    .description('The object availability'),
  lastMeasure: g.ref(() => measureType)
    .omitResolver()
    .optional(),
  measures: g.ref(() => measureType).list()
    .omitResolver()
    .description('The object measures'),
  batteryLevel: g.float()
    .omitResolver()  
    .description('The object battery level'),
  tags: g.ref(() => tagType).list()
    .omitResolver()
    .description('The object tags'),
  thresholds: g.ref(() => thresholdType).list()
    .omitResolver()
    .description('The object thresholds'),
})

export const objectInputType = g.inputType('ObjectInput', {
  objectId: g.int().description('The object id'),
  emplacement: g.ref(() => coordinates)
    .description('The object emplacement'),
})
