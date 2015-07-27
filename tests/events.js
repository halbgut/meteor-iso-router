Tinytest.add('createEvent', function (test) {
  test.equal(typeof createEvent, 'function', 'createEvent should be defined on both server and client')
  var testEvent = createEvent('testevent', {detail: 'yolo'})
  if(Meteor.isClient) {
    test.equal(testEvent.constructor, CustomEvent, 'It should create a object using CustomEvent on the client')
  } else {
    test.equal(testEvent.eventName, 'testevent')
    test.equal(testEvent.eventData, 'yolo')
  }
})

Tinytest.add('eventTarget', function (test) {
  test.equal(typeof eventTarget, 'object', 'events.js should define an object eventTarget')
  test.equal(typeof eventTarget.addEventListener, 'function', 'It should have a function eventTarget.addEventListener')
  test.equal(typeof eventTarget.dispatchEvent, 'function', 'It should have a function eventTarget.dispatchEvent')
  if(Meteor.isClient) {
    test.isTrue(eventTarget.Number, 'It should be the window object on the client')
  }
})
