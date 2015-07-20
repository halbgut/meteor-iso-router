Route = {}

Route.path = undefined
Route.pathRegex = undefined
Route.parameters = undefined

Route.action = function routeAction (action) {
  this.actionValue = action
  return this
}

Route.enter = function routeEnter (enter) {
  this.enterValue = this.enterValue || []
  this.enterValue.push(enter)
  return this
}

Route.exit = function routeExit (exit) {
  this.exitValue = this.exitValue || []
  this.exitValue.push(exit)
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
  this[key](args)
  return this
}

Route.callAll = function routeCallAll (key, parameters, arr) {
  arr = arr ? arr : _.clone(this[key + 'Value'])
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
