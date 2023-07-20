import * as mqtt from 'mqtt'

import { MQTT_SERVER, MQTT_USERNAME, MQTT_PASSWORD } from '../constants'

export const mqttClient = mqtt.connect(MQTT_SERVER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
})
