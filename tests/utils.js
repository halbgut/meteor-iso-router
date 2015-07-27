Tinytest.add('setParams', function (test) {
  test.equal(typeof setParams, 'function', 'utils.js should define a function called setParams')
  var testObj = {}
  var testParams = {}
  if(Meteor.isServer) {
    testParams = { res: {}, req: {}, next: function () {} }
  }
  test.isTrue(setParams(testParams, testObj), 'It should return the new object')
  test.isTrue(testObj.req, 'It should set testObj.req')
  test.isTrue(testObj.res, 'It should set testObj.res')
  test.equal(typeof testObj.next, 'function', 'It should set testObj.next to a function')
  test.isTrue(setParams(testParams), 'It should create an object if none is passed')
})

Tinytest.add('caller', function (test) {
  test.equal(typeof caller, 'function', 'utils.js should define a function called caller')
  test.equal(typeof caller('test'), 'function', 'It should return a function')
  var testFunc = caller('test', 1)
  var testObj = {test: function (n) { return n }}
  test.isTrue(testFunc(testObj), 'It should bind the arguments passed to caller to the new function')
  testObj = {test: function (n, m) { return n + m }}
  testFunc = caller('test', 1)
  test.isTrue(testFunc(testObj, 2), 'It should also pass the arguments passed to the new function')
})
