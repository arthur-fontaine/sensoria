export type AlarmData = {
  userEmails: string[]
}

type AlarmEventMap = {
  'alarm': AlarmData
}

export class AlarmEvent {
  private listeners: Record<
    keyof AlarmEventMap,
    ((event: AlarmEventMap[keyof AlarmEventMap]) => void)[]
  > = {
      'alarm': [],
    }

  addEventListener<EventType extends keyof AlarmEventMap>(
    type: EventType,
    callback: (event: AlarmEventMap[EventType]) => void,
  ): void {
    this.listeners[type].push(callback)
  }

  dispatchEvent<EventType extends keyof AlarmEventMap>(
    eventType: EventType,
    data: AlarmEventMap[EventType],
  ): boolean {
    const listeners = this.listeners[eventType as keyof AlarmEventMap]

    if (listeners === undefined) {
      return false
    }

    for (const listener of listeners) {
      listener(data)
    }

    return true
  }

  removeEventListener<EventType extends keyof AlarmEventMap>(
    type: EventType,
    callback: (event: AlarmEventMap[EventType]) => void,
  ): void {
    const listeners = this.listeners[type]

    if (listeners === undefined) {
      return
    }

    const index = listeners.indexOf(callback)

    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}

export const alarmEvent = new AlarmEvent()
