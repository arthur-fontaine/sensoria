import {relations} from 'drizzle-orm'
import {
  pgTable, serial, varchar, pgEnum, timestamp,
  text, numeric, customType, integer,
} from 'drizzle-orm/pg-core'

export const impactEnum = pgEnum('impact', [
  'high',
  'medium',
  'normal',
  'post_high',
])

export const permissionEnum = pgEnum('permission', [
  'view_rooms',
  'manage_rooms',
  'add_rooms',
  'view_sensors',
  'manage_sensors',
  'add_sensors',
])

const customBlob = customType<{ data: Blob; driverData: string }>({
  dataType() {
    return 'bytea'
  },
  toDriver(value): string {
    const buffer = Buffer.from(JSON.stringify(value))
    const driverData = buffer.toString('base64')
    return driverData
  },
  fromDriver(value): Blob {
    const buffer = Buffer.from(value)
    return new Blob([buffer])
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
    if (typeof value !== 'string'){
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

export const Sensors = pgTable('Sensors', {
  sensorId: serial('sensor_ID').primaryKey(),
  sensorConfigId: integer('sensor_config_ID')
    .references(() => SensorConfig.sensorConfigId, { onDelete: 'cascade' }),
  tagId: integer('tag_ID')
    .references(() => Tags.tagId, { onDelete: 'cascade' }),
  maker: varchar('maker'),
  name: varchar('name'),
  serialNumber: varchar('serial_number'),
  emplacement: customPoint('emplacement'),  
  installationDate: timestamp('installation_date'),
  status: varchar('status'),
  description: text('description'),
})

export const Measures = pgTable('Measures', {
  measureId: serial('measure_ID').primaryKey(),
  sensorId: integer('sensor_ID')
    .references(() => Sensors.sensorId, { onDelete: 'cascade' }),
  value: numeric('value'),
  timestamp: timestamp('timestamp'),
})

export const Users = pgTable('Users', {
  userId: serial('user_ID').primaryKey(),
  invitationId: integer('invitation_ID')
    .references(() => Invitations.invitationId, { onDelete: 'cascade' }),
  roleId: integer('role_ID')
    .references(() => Roles.roleId, { onDelete: 'cascade' }),
  name: varchar('name'),
  email: varchar('email'),
  password: varchar('password'),
  joinedAt: timestamp('joined_at'),
  permissions: permissionEnum('permissions').array(),
})

export const Roles = pgTable('Roles', {
  roleId: serial('role_ID').primaryKey(),
})

export const Halls = pgTable('Halls', {
  hallId: serial('hall_ID').primaryKey(),
  sensorId: integer('sensor_ID')
    .references(() => Sensors.sensorId, { onDelete: 'cascade' }),
  blockId: integer('block_ID')
    .references(() => Blocks.blockId, { onDelete: 'cascade' }),
  hallTagId: integer('hall_tag_ID')
    .references(() => Tags.tagId, { onDelete: 'cascade' }),
  map: customBlob('map'),
})

export const Notifications = pgTable('Notifications', {
  notificationId: serial('notification_ID').primaryKey(),
  measureId: integer('measure_ID')
    .references(() => Measures.measureId, { onDelete: 'cascade' }),
  sensorId: integer('sensor_ID')
    .references(() => Sensors.sensorId, { onDelete: 'cascade' }),
  message: text('message'),
  timestamp: timestamp('timestamp'),
})

export const SensorConfig = pgTable('SensorConfig', {
  sensorConfigId: serial('sensor_config_ID').primaryKey(),
  config : customJsonb<
   { valueMin?: number; valueMax?: number } |
   Record<string, unknown> 
  >('config'),
})

export const Tags = pgTable('Tags', {
  tagId: serial('tag_ID').primaryKey(),
  typeSensorId: integer('type_sensor_ID')
    .references(() => TypeSensor.typeSensorId),
  name: varchar('name'),
})

export const Thresholds = pgTable('Thresholds', {
  thresholdId: serial('threshold_ID').primaryKey(),
  sensorId: integer('sensor_ID').references(() => Sensors.sensorId),
  name: varchar('name'),
  valueMax: numeric('value_max'),
  valueMin: numeric('value_min'),
})

export const Blocks = pgTable('Blocks', {
  blockId: serial('block_ID').primaryKey(),
  name: varchar('name'),
  location: customPoint('location'),
})

export const UsersAccess = pgTable('UsersAccess', {
  userAccessId: serial('user_access_ID').primaryKey(),
  accessId: integer('access_ID').references(() => Access.accessId),
})

export const Access = pgTable('Access', {
  accessId: serial('access_ID').notNull().primaryKey(),
  hallId: integer('hall_ID').notNull(),
})

export const usersRelations = relations(Access, ({ many }) => ({
  Halls: many(Halls),
}))

export const RolesAccess = pgTable('RolesAccess', {
  accessId: serial('access_ID').primaryKey(),
  roleId: integer('role_ID').references(() => Roles.roleId),
})

export const TagsConfig = pgTable('TagsConfig', {
  typeSensorId: integer('type_sensor_ID')
    .references(() => TypeSensor.typeSensorId, { onDelete: 'cascade' }),
  sensorConfigId: integer('sensor_config_ID')
    .references(() => SensorConfig.sensorConfigId, { onDelete: 'cascade' }),
})

export const TypeSensor = pgTable('TypeSensor', {
  typeSensorId: serial('type_sensor_ID').primaryKey(),
  name: varchar('name'),
})

export const Alarms = pgTable('Alarms', {
  alertId: serial('alert_ID').primaryKey(),
  sensorId: integer('sensor_ID')
    .references(() => Sensors.sensorId, { onDelete: 'cascade' }),
  impact: impactEnum('impact'),
  timestamp: timestamp('timestamp'),
})

export const Actions = pgTable('Actions', {
  actionId: serial('action_ID').primaryKey(),
  sensorId: integer('sensor_ID')
    .references(() => Sensors.sensorId, { onDelete: 'cascade' }),
  name: varchar('name'),
  timestamp: timestamp('timestamp'),
})

export const OnboardingRating = pgTable('OnboardingRating', {
  onboardingRatingId: serial('onboarding_rating_id').primaryKey(),
  rate: numeric('rate'),
  note: text('note'),
})

export const Invitations = pgTable('Invitations', {
  invitationId: serial('invitation_ID').primaryKey(),
  userId: integer('user_ID'),
  email: varchar('email'),
  maximumDate: timestamp('maximum_date'),
})

export const InvitationsRelation = relations(Invitations, ({ one }) => ({
  user: one(Users, {
    fields: [Invitations.userId],
    references: [Users.userId],
  }),
}))
