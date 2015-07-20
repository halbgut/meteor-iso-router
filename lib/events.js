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
  eventTarget.dispatchEvent = eventTarget.emit
  eventTarget.addEventListener = eventTarget.on
}

if(Meteor.isClient) {
  eventTarget = window
}
