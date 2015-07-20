Route = {}

function isCalledGlobal (globalObj) {
  return globalObj.isPrototypeOf(this) ? false : true
}

Route.path = undefined
Route.pathRegex = undefined
Route.parameters = undefined

Route.actionValue = undefined
Route.actionGlobalValue
Route.action = function routeAction (action) {
  if(isCalledGlobal(Route)) {
    this.actionGlobalValue = action
  } else {
    this.actionValue = action
  }
  return this
}

Route.enterValue = undefined
Route.enterGlobalValue = []
Route.enter = function routeEnter (enter) {
  if(isCalledGlobal(Route)) {
    this.enterValue = this.enterValue || []
    this.enterValue.push(enter)
  } else {
    this.enterGlobalValue.push(enter)
  }
  return this
}

Route.exitValue = undefined
Route.exitGlobalValue = []
Route.exit = function routeExit (exit) {
  if(isCalledGlobal(Route)) {
    this.exitValue = this.exitValue || []
    this.exitValue.push(exit)
  } else {
    this.exitGlobalValue.push(exit)
  }
  return this
}

Route.server = function routeServer (serverAction) {
  this.serverValue = serverAction
  return this
}

Route.set = function routeSet (key, value) {
  this[key] = (typeof value == 'function') ? value() : value
  return this
}

Route.call = function routeCall (key/*, args... */) {
  var args = _.rest(arguments)
  ; (this[key + 'Value'] || this[key + 'GlobalValue'])(args)
  return this
}

Route.callAll = function routeCallAll (key, parameters, arr) {
  arr = arr ?
    arr :
    this[key + 'GlobalValue']
      .concat(this[key + 'Value'])
  if(arr.length) {
    arr.shift()
      (parameters, this.callAll.bind(this, key, parameters, arr))
  }
  return this
}

Route.match = function routeMatch (path) {
  return (
    this.pathRegex.test(path) ?
    this :
    false
  )
}
