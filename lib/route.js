/**
 * An object defined by the `connect` npm package. Meteor uses this internally and I'm just hooking into it.
 * @typedef {Object} connectHandle
 * @prop {Object} req - Documented in the nodejs HTTP package
 * @prop {Object} res - Documented in the nodejs HTTP package
 * @prop {Object} next - The next function on the connect stack. Documented inside the connect npm package.
 */

/**
 * @namespace
 */
Route = {}

/**
 * The path the route is for
 * @type {string}
 */
Route.path = undefined

/**
 * The paresed regex for the path
 * @locus {anywhere}
 * @type {regexp}
 */
Route.pathRegex = undefined

/**
 * The array returned by pathRegex.exec
 * @locus {anywhere}
 * @type {array}
 */
Route.parameters = undefined

/**
 * The incomming request object
 * @locus server
 * @type {connectHandle.req}
 */
Route.req = undefined

/**
 * The connection's response object
 * @locus server
 * @type {connectHandle.res}
 */
Route.res = undefined

/**
 * The next middleware on the connection stack
 * @locus server
 * @type {connectHandle.next}
 */
Route.next = undefined

Route._actionValue = undefined
Route._actionGlobalValue

/**
 * Define an action that should be triggered when the route is called. This can also called on the global `IsoRouter.Route` This will set a default action.
 * @type {Route.action}
 */
Route.action = function routeAction (action) {
  if(isCalledGlobal(Route)) {
    this._actionGlobalValue = action
  } else {
    this._actionValue = action
  }
  return this
}
/**
 * A function that is called when the client navigates to a route.
 * @callback Route.action
 * @param {Array} The array returned by pathRegex.exec
 */

Route._enterValue = undefined
Route._enterGlobalValue = []

/**
 * Add enter hooks to the route. This can also called on the global `IsoRouter.Route`. It will add default hooks which will always be called.
 * @param {Route.enterHook} An enter hook to be added to the route
 */
Route.enter = function routeEnter (enter) {
  if(isCalledGlobal(Route)) {
    this._enterValue = this._enterValue || []
    this._enterValue.push(enter)
  } else {
    this._enterGlobalValue.push(enter)
  }
  return this
}
/**
 * The `enterHooks` of a route are callen before the action is called. When you set global `enterHooks` they will be triggered on each route. Even if the route has it's own.
 * @callback Route.enterHook
 * @param {Array} The array returned by pathRegex.exec
 */

Route._exitValue = undefined
Route._exitGlobalValue = []

/**
 * Adds an exit hook. This can also called on the global `IsoRouter.Route`. It will add a default hook which will always be called.
 * @param {Route.exitHook} The exit hook to add
 */
Route.exit = function routeExit (exit) {
  if(isCalledGlobal(Route)) {
    this._exitValue = this._exitValue || []
    this._exitValue.push(exit)
  } else {
    this._exitGlobalValue.push(exit)
  }
  return this
}
/**
 * On the client `exitHook`s are called when a client navigates to an other route. When you set a global `exitHook` it will be triggered on each route. Even if the route has it's own.
 * @callback Route.exitHook
 */

Route.set = function routeSet (key, value) {
  this[key] = (typeof value == 'function') ? value() : value
  return this
}

Route.call = function routeCall (key/*, args... */) {
  var args = _.rest(arguments)
  ; (this[['_', 'Value'].join(key)] || this[['_', 'GlobalValue'].join(key)])(args)
  return this
}

Route.callAll = function routeCallAll (key, parameters, arr) {
  arr = arr ?
    arr :
    this[['_', 'GlobalValue'].join(key)]
      .concat(this[['_', 'Value'].join(key)])
  if(arr.length) {
    arr.shift()
      (parameters, this.callAll.bind(this, key, parameters, arr))
  }
  return this
}

/**
 * Calls pathRegex.exec
 * @param {string} The url to execute the regex on
 * @return {false|array} Returns false if the test fails and returns the exec's return on success
 */
Route.match = function routeMatch (url) {
  if(!this.pathRegex.test(url)) return false
  return this.pathRegex.exec(url)
}
