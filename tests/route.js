function isRoute (obj) {
  return Route.isPrototypeOf(obj)
}

Tinytest.add('Route.action', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.action, 'function', 'Route should have a function action')
  test.isTrue(isRoute(route.action(function () {})), 'It should return the route that it\'s beeing called on.')
  test.equal(typeof route._actionValue, 'function', 'It should set the passed function to Route._actionValue')
  Route.action(function () {})
  test.equal(typeof route._actionGlobalValue, 'function', 'It should set the action to _actionGlobalValue if it\'s called on the global object')
})

Tinytest.add('Route.enter', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.enter, 'function', 'Route should have a function enter')
  test.isTrue(isRoute(route.enter(function () {})), 'It should return the route that it\'s beeing called on.')
  test.equal(route._enterValue.length, 1, 'It should push the passed functions to Route._enterValue')
  Route.enter(function () {})
  test.equal(route._enterGlobalValue.length, 1, 'It should add the enter hooks to _enterGlobalValue if it\'s called on the global object')
})

Tinytest.add('Route.exit', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.exit, 'function', 'Route should have a function exit')
  test.isTrue(isRoute(route.exit(function () {})), 'It should return the route that it\'s beeing called on.')
  test.equal(route._exitValue.length, 1, 'It should push the passed functions to Route._exitValue')
  Route.exit(function () {})
  test.equal(route._exitGlobalValue.length, 1, 'It should add the exit hooks to _exitGlobalValue if it\'s called on the global object')
})

Tinytest.add('Route.set', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.set, 'function', 'Route should have a function set')
  test.isTrue(isRoute(route.set('key', 'value')), 'It should return the route that it\'s beeing called on.')
  test.equal(route['key'], 'value', 'It should set the value of the passed key to the passed value')
  test.equal(route.set('key', function () {return 'else'}).key, 'else', 'If a function is passed as a value the function should be called and the return value should be set as the value')
})

Tinytest.add('Route.call', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.call, 'function', 'Route should have a function call')
  route._testValue = function () {return true}
  test.isTrue(route.call('test'), 'It should call the function with the function under the key prefixed by an underscore and suffixed by "Value".')
  test.isTrue(isRoute(route.call('test')), 'It should return the route that it\'s beeing caled on')
  route._testGlobGlobalValue = function () {return true}
  test.isTrue(isRoute(route.call('testGlob')), 'It should call the function under the key suffixed with GlobalValue if the one with Value doesn\'t exist')
  var shouldEqualTest = false
  route._test42Value = function (str) {
    shouldEqualTest = str
  }
  test.equal((route.call('test42', 'test') && shouldEqualTest), 'test', 'It should pass parameters after the first one to the called function')
})

Tinytest.add('Route.callAll', function (test) {
  var route = Object.create(Route)
  test.equal(typeof Route.callAll, 'function', 'Route should hava a function called callAll')
  test.isTrue(isRoute(route.callAll()), 'It should return a route')
  var shouldBeTrue = false
  var shouldBeFalse = true
  route._testValue = [
    function (next) {
      shouldBeTrue = false
      next()
    },
    function (next) {
      shouldBeTrue = true
      next()
    }
  ]
  test.isTrue((route.callAll('test') && shouldBeTrue), 'It should call all functions inside _[key]Value')
  Route._testGlobalValue = [
    function (next) {
      shouldBeFalse = true
      next()
    },
    function (next) {
      shouldBeFalse = false
      next()
    }
  ]
  test.isTrue((route.callAll('test') && !shouldBeFalse), 'It should also call all functions inside _[key]GlobalValue')
  shouldAlsoBeTrue = false
  route._test2Value = [function (val) {
    shouldAlsoBeTrue = val
  }]
  test.isTrue((route.callAll('test2', true) && shouldAlsoBeTrue), 'It should pass an array of parameters to the called functions.')
})

Tinytest.add('Route.match', function (test) {
  var route = Object.create(Route)
  test.equal(typeof route.match, 'function', 'Route should have a function match.')
  route.pathRegex = /\w+/g
  test.equal(typeof route.match('asdf'), 'object', 'It should return an array when the regex matches matches')
  test.isFalse(route.match('asdf12*'), 'It should return false if the regex doesn\'t match')
})
