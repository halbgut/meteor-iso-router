Route = {}

Route.path = undefined
Route.pathRegex = undefined
Route.parameters = undefined

Route._actionValue = undefined
Route._actionGlobalValue
Route.action = function routeAction (action) {
  if(isCalledGlobal(Route)) {
    this._actionGlobalValue = action
  } else {
    this._actionValue = action
  }
  return this
}

Route._enterValue = undefined
Route._enterGlobalValue = []
Route.enter = function routeEnter (enter) {
  if(isCalledGlobal(Route)) {
    this._enterValue = this._enterValue || []
    this._enterValue.push(enter)
  } else {
    this._enterGlobalValue.push(enter)
  }
  return this
}

Route._exitValue = undefined
Route._exitGlobalValue = []
Route.exit = function routeExit (exit) {
  if(isCalledGlobal(Route)) {
    this._exitValue = this._exitValue || []
    this._exitValue.push(exit)
  } else {
    this._exitGlobalValue.push(exit)
  }
  return this
}

Route.server = function routeServer (serverAction) {
  this._serverValue = serverAction
  return this
}

Route.set = function routeSet (key, value) {
  this[key] = (typeof value == 'function') ? value() : value
  return this
}

Route.call = function routeCall (key/*, args... */) {
  var args = _.rest(arguments)
  ; (this[key + '_Value'] || this[key + '_GlobalValue'])(args)
  return this
}

Route.callAll = function routeCallAll (key, parameters, arr) {
  arr = arr ?
    arr :
    this[key + '_GlobalValue']
      .concat(this[key + '_Value'])
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
