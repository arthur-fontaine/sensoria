/* eslint-disable max-lines */
import { relations } from 'drizzle-orm'
import {
  pgTable, serial, varchar, pgEnum, timestamp, primaryKey,
  text, numeric, customType, integer, boolean,
} from 'drizzle-orm/pg-core'

const customBuffer = customType<{
  data: Buffer; driverData: Buffer; notNull: false; default: false
}>({
  dataType() {
    return 'bytea'
  },
})

const customPoint = customType<{ data: [number, number] }>({
  dataType() {
    return 'text'
  },
  toDriver(value): string {
    return JSON.stringify(value)
  },
  fromDriver(value) {
    if (typeof value !== 'string') {
      throw new TypeError(`Invalid type ${typeof value} for Point`)
    }

    return JSON.parse(value)
  },
})

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb'
    },
    toDriver(value: TData): string {
      return JSON.stringify(value)
    },
  })(name)

export const blocks = pgTable('blocks', {
  blockId: serial('block_ID').primaryKey(),

  name: varchar('name').notNull(),
  location: customPoint('location').notNull(),
})

export const blocksRelations = relations(blocks, ({ many }) => ({
  halls: many(halls),
  objects: many(objects),
  users: many(users),
}))

export const halls = pgTable('halls', {
  hallId: serial('hall_ID').notNull().primaryKey(),

  label: varchar('label').notNull(),
  map: customBuffer('map').notNull(),

  blockId: integer('block_ID').notNull()
    .references(() => blocks.blockId, { onDelete: 'cascade' }),
})

export const hallsRelations = relations(halls, ({ one, many }) => ({
  block: one(blocks, {
    fields: [halls.blockId],
    references: [blocks.blockId],
  }),
  objects: many(objects),
  accesses: many(usersToAccesses),
}))

export const objectTypes = pgTable('objectTypes', {
  objectTypeId: serial('object_type_ID').primaryKey(),
  name: varchar('name').notNull(),
})

export const objectTypesRelations = relations(objectTypes, ({ many }) => ({
  objects: many(objects),
  tagObjectConfigs: many(tagObjectConfigs),
}))

export const objects = pgTable('objects', {
  objectId: serial('object_ID').primaryKey(),

  name: varchar('name').notNull(),
  description: text('description'),
  iconName: varchar('icon_name').notNull(),

  maker: varchar('maker').notNull(),
  serialNumber: varchar('serial_number').notNull(),

  // If installationDate, emplacement, or hallId are null,
  // the object is not installed
  installationDate: timestamp('installation_date'),
  emplacement: customPoint('emplacement'),
  hallId: integer('hall_ID')
    .references(() => halls.hallId, { onDelete: 'set null' }),

  objectTypeId: integer('object_type_ID').notNull()
    .references(() => objectTypes.objectTypeId, { onDelete: 'cascade' }),

  // Use blockId to retrieve the available objects in a block
  blockId: integer('block_ID').notNull()
    .references(() => blocks.blockId, { onDelete: 'cascade' }),
  objectConfigId: integer('object_config_ID').notNull()
    .references(() => objectConfigs.objectConfigId, { onDelete: 'cascade' }),
})

export const objectsRelations = relations(objects, ({ one, many }) => ({
  hall: one(halls, {
    fields: [objects.hallId],
    references: [halls.hallId],
  }),
  block: one(blocks, {
    fields: [objects.blockId],
    references: [blocks.blockId],
  }),
  objectConfig: one(objectConfigs, {
    fields: [objects.objectConfigId],
    references: [objectConfigs.objectConfigId],
  }),
  objectType: one(objectTypes, {
    fields: [objects.objectTypeId],
    references: [objectTypes.objectTypeId],
  }),
  objectsToTags: many(objectsToTags),
  measures: many(measures),
  triggers: many(triggers),
  thresholds: many(thresholds),
}))

export const triggers = pgTable('triggers', {
  triggerId: serial('trigger_ID').primaryKey(),

  newState: boolean('new_state').notNull(),

  objectId: integer('object_ID').notNull()
    .references(() => objects.objectId, { onDelete: 'cascade' }),
})

export const triggersRelations = relations(triggers, ({ one }) => ({
  object: one(objects, {
    fields: [triggers.objectId],
    references: [objects.objectId],
  }),
  thresholdsTriggers: one(thresholdsTriggers, {
    fields: [triggers.triggerId],
    references: [thresholdsTriggers.triggerId],
  }),
}))

export const thresholds = pgTable('thresholds', {
  thresholdId: serial('threshold_ID').primaryKey(),

  name: varchar('name').notNull(),
  valueMin: numeric('value_min'),
  valueMax: numeric('value_max'),

  sensorId: integer('sensor_ID')
    .references(() => objects.objectId),
})

export const thresholdsRelations = relations(thresholds, ({ one }) => ({
  sensor: one(objects, {
    fields: [thresholds.sensorId],
    references: [objects.objectId],
  }),
  thresholdsTriggers: one(thresholdsTriggers, {
    fields: [thresholds.thresholdId],
    references: [thresholdsTriggers.thresholdId],
  }),
}))

export const triggerEventEnum = pgEnum('triggerEvent', [
  'lessThanMin',
  'greaterThanMax',
])

export const thresholdsTriggers = pgTable('thresholdsTriggers', {
  thresholdTriggerId: serial('threshold_trigger_ID').primaryKey(),

  triggerEvent: triggerEventEnum('trigger_event').notNull(),

  thresholdId: integer('threshold_ID').notNull()
    .references(() => thresholds.thresholdId, { onDelete: 'cascade' }),
  triggerId: integer('trigger_ID').notNull()
    .references(() => triggers.triggerId, { onDelete: 'cascade' }),
})

export const thresholdsTriggersRelations = relations(
  thresholdsTriggers,
  ({ one }) => ({
    threshold: one(thresholds, {
      fields: [thresholdsTriggers.thresholdId],
      references: [thresholds.thresholdId],
    }),
    trigger: one(triggers, {
      fields: [thresholdsTriggers.triggerId],
      references: [triggers.triggerId],
    }),
  }),
)

export const objectConfigs = pgTable('objectConfigs', {
  objectConfigId: serial('object_config_ID').primaryKey(),

  config: customJsonb<
    { valueMin?: number; valueMax?: number }
  // eslint-disable-next-line lines-around-comment
  // { valueMin?: number; valueMax?: number } |
  // Record<string, unknown>
  >('config').notNull(),
})

export const objectConfigRelations = relations(objectConfigs, ({ one }) => ({
  objects: one(objects, {
    fields: [objectConfigs.objectConfigId],
    references: [objects.objectConfigId],
  }),
}))

export const tags = pgTable('tags', {
  tagId: serial('tag_ID').primaryKey(),

  name: varchar('name').notNull(),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  objectsToTags: many(objectsToTags),
  objectConfigs: many(objectConfigs),
}))

export const objectsToTags = pgTable('objectsToTags', {
  objectId: integer('object_ID').notNull()
    .references(() => objects.objectId, { onDelete: 'cascade' }),
  tagId: integer('tag_ID').notNull()
    .references(() => tags.tagId, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey(table.objectId, table.tagId),
}))

export const objectsToTagsRelations = relations(objectsToTags, ({ one }) => ({
  object: one(objects, {
    fields: [objectsToTags.objectId],
    references: [objects.objectId],
  }),
  tag: one(tags, {
    fields: [objectsToTags.tagId],
    references: [tags.tagId],
  }),
}))

export const tagObjectConfigs = pgTable('tagConfigs', {
  tagConfigId: serial('tag_config_ID').primaryKey(),

  objectTypeId: integer('object_type_ID').notNull()
    .references(() => objectTypes.objectTypeId, { onDelete: 'cascade' }),
  objectConfigId: integer('object_config_ID').notNull()
    .references(() => objectConfigs.objectConfigId, { onDelete: 'cascade' }),

  tagId: integer('tag_ID').notNull()
    .references(() => tags.tagId, { onDelete: 'cascade' }),
})

export const tagObjectConfigsRelations = relations(
  tagObjectConfigs,
  ({ one }) => ({
    objectConfig: one(objectConfigs, {
      fields: [tagObjectConfigs.objectConfigId],
      references: [objectConfigs.objectConfigId],
    }),
    objectType: one(objectTypes, {
      fields: [tagObjectConfigs.objectTypeId],
      references: [objectTypes.objectTypeId],
    }),
    tag: one(tags, {
      fields: [tagObjectConfigs.tagId],
      references: [tags.tagId],
    }),
  }),
)

export const measures = pgTable('measures', {
  measureId: serial('measure_ID').primaryKey(),

  // measureType can be battery, temperature, humidity, etc.
  measureType: varchar('measure_type').notNull(),
  value: numeric('value').notNull(),
  timestamp: timestamp('timestamp').notNull(),

  sensorId: integer('sensor_ID').notNull()
    .references(() => objects.objectId, { onDelete: 'cascade' }),
})

export const measuresRelations = relations(measures, ({ one }) => ({
  sensor: one(objects, {
    fields: [measures.sensorId],
    references: [objects.objectId],
  }),
}))

export const importanceEnum = pgEnum('importance', [
  'high',
  'medium',
  'normal',
  'post_high',
])

export const notifications = pgTable('notifications', {
  notificationId: serial('notification_ID').primaryKey(),

  message: text('message').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  importance: importanceEnum('importance').notNull(),

  measureId: integer('measure_ID').notNull()
    .references(() => measures.measureId),
})

export const notificationsRelations = relations(notifications, ({ one }) => ({
  measure: one(measures, {
    fields: [notifications.measureId],
    references: [measures.measureId],
  }),
}))

export const permissionEnum = pgEnum('permission', [
  'view_rooms',
  'manage_rooms',
  'add_rooms',
  'view_sensors',
  'manage_sensors',
  'add_sensors',
])

export const users = pgTable('users', {
  userId: serial('user_ID').primaryKey(),

  name: varchar('name').notNull(),
  email: varchar('email').notNull(), // Drizzle-ORM does not support unique
  password: varchar('password').notNull(),

  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  permissions: permissionEnum('permissions').array()
    .notNull().default([]),

  blockId: integer('block_ID')
    .references(() => blocks.blockId, { onDelete: 'cascade' }),
  invitationId: integer('invitation_ID')
    .references(() => invitations.invitationId),
  roleId: integer('role_ID').notNull()
    .references(() => roles.roleId),
})

export const usersRelations = relations(users, ({ many, one }) => ({
  block: one(blocks, {
    fields: [users.blockId],
    references: [blocks.blockId],
  }),
  invitation: one(invitations, {
    fields: [users.invitationId],
    references: [invitations.invitationId],
  }),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.roleId],
  }),
  accesses: many(usersToAccesses),
}))

export const roles = pgTable('roles', {
  roleId: serial('role_ID').primaryKey(),

  permissions: permissionEnum('permissions').array()
    .notNull().default([]),
})

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  accesses: many(rolesToAccesses),
}))

export const usersToAccesses = pgTable('usersToAccesses', {
  userAccessId: serial('user_access_ID').primaryKey(),

  userId: integer('user_ID').notNull()
    .references(() => users.userId),

  haveAccess: boolean('have_access').notNull(),
  hallId: integer('hall_ID').notNull()
    .references(() => halls.hallId),
})

export const usersToAccessesRelations = relations(
  usersToAccesses,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToAccesses.userId],
      references: [users.userId],
    }),
    hall: one(halls, {
      fields: [usersToAccesses.hallId],
      references: [halls.hallId],
    }),
  }),
)

export const rolesToAccesses = pgTable('rolesToAccesses', {
  roleAccessId: serial('role_access_ID').primaryKey(),

  roleId: integer('role_ID').notNull()
    .references(() => roles.roleId),

  haveAccess: boolean('have_access').notNull(),
  hallId: integer('hall_ID').notNull()
    .references(() => halls.hallId),
})

export const rolesAccessRelations = relations(rolesToAccesses, ({ one }) => ({
  role: one(roles, {
    fields: [rolesToAccesses.roleId],
    references: [roles.roleId],
  }),
  hall: one(halls, {
    fields: [rolesToAccesses.hallId],
    references: [halls.hallId],
  }),
}))

export const onboardingRating = pgTable('onboardingRating', {
  onboardingRatingId: serial('onboarding_rating_id').primaryKey(),

  rate: numeric('rate').notNull(),
  comment: varchar('comment').notNull(),

  userId: integer('user_ID').notNull()
    .references(() => users.userId),
})

export const onboardingRatingRelations = relations(
  onboardingRating,
  ({ one }) => ({
    user: one(users, {
      fields: [onboardingRating.userId],
      references: [users.userId],
    }),
  }),
)

export const invitations = pgTable('invitations', {
  invitationId: serial('invitation_ID').primaryKey(),

  email: varchar('email').notNull(),
  maximumDate: timestamp('maximum_date').notNull(),

  userId: integer('user_ID').notNull(),
})

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.userId],
  }),
}))
