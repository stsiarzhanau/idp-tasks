export class CustomEvent {
  constructor(name) {
    this.name = name
    this.callbacks = []
  }

  registerCallback(cb) {
    this.callbacks.push(cb)
  }

  unregisterCallback(cb) {
    this.callbacks = this.callbacks.filter(callback => callback !== cb)
  }

  handle(data) {
    this.callbacks.map(cb => cb(data))
  }
}

export default class CustomEventEmitter {
  constructor() {
    this.events = {}
  }

  emit(eventName, data) {
    const e = this.events[eventName]
    if (e) {
      e.handle(data)
    }
  }

  on(eventName, cb) {
    let e = this.events[eventName]
    if (!e) {
      e = new CustomEvent(eventName)
      this.events[eventName] = e
    }
    e.registerCallback(cb)
  }

  removeListener(eventName, cb) {
    const e = this.events[eventName]
    if (e && e.callbacks.includes(cb)) {
      e.unregisterCallback(cb)
      if (e.callbacks.length === 0) {
        delete this.events[eventName]
      }
    }
  }
}
