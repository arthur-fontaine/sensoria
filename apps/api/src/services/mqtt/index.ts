import { SENSOR_DATA_TOPIC_REGEX } from './constants'
import { mqttClient } from './utils/mqtt-client'
import { readObjectsDump, writeSensorToDump } from './utils/objects-dump'
import { sensorDataEvent, sensorDataSchema } from './utils/sensor-data-event'

let MQTT_BASE_TOPIC: string | undefined = ''

if (typeof window === 'undefined') {
  MQTT_BASE_TOPIC = process.env.MQTT_BASE_TOPIC

  if (MQTT_BASE_TOPIC === undefined) {
    throw new Error('MQTT_BASE_TOPIC is not defined')
  }
}

mqttClient.on('connect', function () {
  mqttClient.subscribe(`${MQTT_BASE_TOPIC}/packet/#`, function (error) {
    if (error) {
      console.error(error)
    }
  })
})

mqttClient.on('message', function (topic, message) {
  handleMqttMessage(topic, message.toString())
})

let objects = readObjectsDump()

function handleMqttMessage(topic: string, rawData: string) {
  const { gateway_id, node_id } = (
    SENSOR_DATA_TOPIC_REGEX.captures(topic) ?? {}
  )

  if (
    gateway_id === undefined ||
    node_id === undefined
  ) {
    console.error(`Invalid topic: ${topic}`)
    return
  }

  const result = sensorDataSchema.safeParse(JSON.parse(rawData))

  if (!result.success) {
    console.error(result.error)
    return
  }

  const { source_address, tx_time_ms_epoch, data, sensor_id } = result.data

  const sensor = objects.topics[topic]?.sensors.find(
    (sensor) => sensor.id === (sensor_id === undefined
      ? undefined
      : Number(sensor_id)),
  )

  if (sensor === undefined) {
    writeSensorToDump(topic, Number(sensor_id))
    objects = readObjectsDump()
  }

  sensorDataEvent.dispatchEvent('sensor-data', {
    gateway_id,
    node_id,
    sensor_id,
    source_address,
    tx_time_ms_epoch,
    data,
  })
}
