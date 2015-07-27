/* createEvent(name, data)
 * An isomorphic function that creates a new event
 */
createEvent = function createEvent (name, data) {
  if(Meteor.isServer) return {
    eventName: name,
    eventData: (data && data.detail) ? data.detail : {}
  }
  if(Meteor.isClient) return new CustomEvent(name, data)
}

if(Meteor.isServer) {
  var events = Npm.require('events')
  /* On the server-side all events are emitted on this object */
  eventTarget = new events.EventEmitter
  /* Wrap `emit` and call it dispatchEvent. This has the same API as a client-side `EventTarget` */
  eventTarget.dispatchEvent = function dispatchEvent (event /*, arguments */) {
    eventTarget.emit(event.eventName, _.rest(arguments))
  }
  /* Alias `eventTarget.addListener` to be isomorphic */
  eventTarget.addEventListener = eventTarget.addListener
}

if(Meteor.isClient) {
  /* On the client all events are dispatched from the winodw object. */
  eventTarget = window
}
