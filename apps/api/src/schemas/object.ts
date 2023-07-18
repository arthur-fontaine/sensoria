import { g } from 'garph'

import { hallType } from './hall'
import { measureType } from './measure'
import { coordinates } from './scalar/coordinates'
import { dateType } from './scalar/date'
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
  installationDate: g.ref(() => dateType).optional()
    .description('The object installation date'),
  hallId: g.int().optional().description('The object hall id'),
  hall: g.ref(() => hallType).optional()
    .omitResolver()
    .description('The object hall'),
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
    .optional()
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
