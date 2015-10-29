let listeners = {}

/**
 * Adds a listener to an event to the beginning of an callback array. The callback array is executed front to back. That means, that the last event you add via this function will be the first to execute. This function should be the default to add event-listeners.
 * @argument {string} eventName - The event to add the listener to
 * @argument {eventCallback} callback - A function to execute when the event dispatched
 */
addListener = function (eventName, cb) {
  listeners[eventName] = [cb].concat(listeners[eventName] || [])
}

/**
 * Adds a listener to the end of the callback array. It actually adds the listener to the position -1. That's because the last listener on the server-side needs to be the one added by IsoRouter itself wich calls `next` on the connect handler-stack. This should only be used if you want to make sure it is called after all other listeners. For example when you want to catch 404s.
 * @argument {string} eventName - The Event to Listen to
 * @argument {eventCallback} callback - A function to be called when the event dispatched
 */
appendListener = function (eventName, cb) {
  listeners[eventName] = [listeners[eventName].slice(-1)].concat(listeners[eventName].slice(0, -1))
}

/**
 * Creates a new callback array for.
 * @argument {string} eventName - The name of the event and the callback array
 * @argument {eventCallback} callback - A function to be called last when the event dispatched
 */
createEvent = function (eventName, cb) {
  listeners[eventName] = [cb]
}

/**
 * Dispatches an event. Every function in the callback array will be called front (0) to back.
 * @argument {string} eventName - The name of the event to be dispatched
 * @argument {*} data - Anything you want to pass to the event listeners
 */
dispatchEvent = function (eventName, data) {
  console.log(listeners)
  listeners[eventName].forEach((el) => el(data))
}

