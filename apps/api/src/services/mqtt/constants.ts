import dotenv from 'dotenv'
import { TypedRegEx } from 'typed-regex'

dotenv.config()

let _MQTT_SERVER: string | undefined
let _MQTT_USERNAME: string | undefined
let _MQTT_PASSWORD: string | undefined
let _MQTT_BASE_TOPIC: string | undefined

if (typeof window === 'undefined') {
  _MQTT_SERVER = process.env.MQTT_SERVER
  _MQTT_USERNAME = process.env.MQTT_USERNAME
  _MQTT_PASSWORD = process.env.MQTT_PASSWORD
  _MQTT_BASE_TOPIC = process.env.MQTT_BASE_TOPIC

  if (_MQTT_SERVER === undefined) {
    throw new Error('MQTT_SERVER is not defined')
  }

  if (_MQTT_USERNAME === undefined) {
    throw new Error('MQTT_USERNAME is not defined')
  }

  if (_MQTT_PASSWORD === undefined) {
    throw new Error('MQTT_PASSWORD is not defined')
  }

  if (_MQTT_BASE_TOPIC === undefined) {
    throw new Error('MQTT_BASE_TOPIC is not defined')
  }
} else {
  _MQTT_SERVER = ''
  _MQTT_USERNAME = ''
  _MQTT_PASSWORD = ''
  _MQTT_BASE_TOPIC = ''
}

export const MQTT_SERVER = _MQTT_SERVER
export const MQTT_USERNAME = _MQTT_USERNAME
export const MQTT_PASSWORD = _MQTT_PASSWORD
export const MQTT_BASE_TOPIC = _MQTT_BASE_TOPIC

export const UUID_REGEX = (
  /^[\dA-Fa-f]{8}(?:\b-[\dA-Fa-f]{4}){3}\b-[\dA-Fa-f]{12}$/
)

export const SENSOR_DATA_TOPIC_REGEX = TypedRegEx(`^${_MQTT_BASE_TOPIC}\
/packet/(?<gateway_id>${UUID_REGEX.source.slice(1, -1)})\
/(?<node_id>${UUID_REGEX.source.slice(1, -1)})/([0-9]+)$`)

// /(?<node_id>${UUID_REGEX.source.slice(1, -1)})/(?<sensor_id>[0-9]+)$`)

export const OBJECTS_DUMP_FILE_PATH = './.mqtt-objects-dump.json'
