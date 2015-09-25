/* createEvent(name, data)
 * An isomorphic function that creates a new event
 */
createEvent = function createEvent (eventName, eventData) {
  if(Meteor.isServer) return { eventName, eventData }
  if(Meteor.isClient) return new CustomEvent(name, { detail: data })
}

dispatchEvent = function dispatchEvent (eventName, data) {
  eventTarget.dispatchEvent(createEvent(eventName, data))
}

if(Meteor.isServer) {
  var events = Npm.require('events')
  /* On the server-side all events are emitted on this object */
  eventTarget = new events.EventEmitter
  /* Wrap `emit` and call it dispatchEvent. This has the same API as a client-side `EventTarget` */
  eventTarget.dispatchEvent = function dispatchEvent (event) {
    eventTarget.emit(event.eventName, { detail: event.eventData })
  }
  /* Alias `eventTarget.addListener` to be isomorphic */
  eventTarget.addEventListener = eventTarget.addListener
} else {
  /* On the client all events are dispatched from the winodw object. */
  eventTarget = window
}

