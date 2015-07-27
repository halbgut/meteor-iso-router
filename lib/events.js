createEvent = function createEvent (name, data) {
  if(Meteor.isServer) return {
    eventName: name,
    eventData: (data && data.detail) ? data.detail : {}
  }
  if(Meteor.isClient) return new CustomEvent(name, data)
}

if(Meteor.isServer) {
  var events = Npm.require('events')
  eventTarget = new events.EventEmitter
  eventTarget.dispatchEvent = function dispatchEvent (event /*, arguments */) {
    eventTarget.emit(event.eventName, _.rest(arguments))
  }
  eventTarget.addEventListener = eventTarget.addListener
}

if(Meteor.isClient) {
  eventTarget = window
}
