function isRoute (obj) {
  return IsoRouter.Route.__proto__.isPrototypeOf(obj)
}

Tinytest.add('Route.addListener', function (test) {
  var route = Object.create(IsoRouter.Route.__proto__)
  test.equal(typeof route.addListener, 'function', 'Route should have a function addListener')
  test.isTrue(isRoute(route.addListener('enter', function () {})), 'It should return the route that it\'s beeing called on.')
})

Tinytest.add('Route.set', function (test) {
  var route = Object.create(IsoRouter.Route.__proto__)
  test.equal(typeof route.set, 'function', 'Route should have a function set')
  test.isTrue(isRoute(route.set('key', 'value')), 'It should return the route that it\'s beeing called on.')
  test.equal(route['key'], 'value', 'It should set the value of the passed key to the passed value')
  test.equal(route.set('key', function () {return 'else'}).key, 'else', 'If a function is passed as a value the function should be called and the return value should be set as the value')
})

Tinytest.add('Route.match', function (test) {
  var route = Object.create(IsoRouter.Route.__proto__)
  test.equal(typeof route.match, 'function', 'Route should have a function match.')
  route.pathRegex = /\w+/g
  test.equal(typeof route.match('asdf'), 'object', 'It should return an array when the regex matches matches')
  test.isFalse(route.match('asdf12*'), 'It should return false if the regex doesn\'t match')
})

Tinytest.add('Route.matchToObject', function (test) {
  var thisRoute = IsoRouter.route('/:test/:url')
  test.equal(thisRoute.matchToObject('/a/b'), {test: 'a', url: 'b'})
  IsoRouter.routes = []
})

