import fs from 'node:fs'

import { z } from 'zod'

import { OBJECTS_DUMP_FILE_PATH } from '../constants'

export const objectsDumpSchema = z.object({
  // topics: z.record(
  //   z.string(),
  sensors: z.array(
    z.object({
      id: z.number(),
      name: z.string().optional(),
      icon: z.string().optional(),
      type: z.string().optional(),
    }),
  ),
  // eslint-disable-next-line lines-around-comment
  // ),
  icons: z.record(
    z.string(),
    z.string(),
  ),
})

export function readObjectsDump() {
  // read or create objects dump file

  if (!fs.existsSync(OBJECTS_DUMP_FILE_PATH)) {
    fs.writeFileSync(OBJECTS_DUMP_FILE_PATH, JSON.stringify({
      sensors: {},
      icons: {},
    }))
  }

  const objectsDump = fs.readFileSync(OBJECTS_DUMP_FILE_PATH, 'utf8')
  const objects = JSON.parse(objectsDump)
  return objectsDumpSchema.parse(objects)
}

export function writeSensorToDump(
  sensorId: number,
  sensorName?: string,
  sensorIcon?: string,
  sensorType?: string,
) {
  const objectsDump = readObjectsDump()

  objectsDump.sensors.push({
    id: sensorId,
    name: sensorName,
    icon: sensorIcon,
    type: sensorType,
  })

  fs.writeFileSync(
    OBJECTS_DUMP_FILE_PATH,
    JSON.stringify(objectsDump, undefined, 2),
  )
}
