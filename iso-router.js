
var Route = {}

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

IsoRouter = {}

IsoRouter.routes = []

IsoRouter.route = function isoRouterRoute (path) {
  return (
    this.routes[this.routes.push(Object.create(Route)) - 1]
      .set('path', path)
      .set('pathRegex', function () {
        this.parameters = []
        return pathToRegexp(path, this.parameters)
      })
  )
}

IsoRouter.getRouteForPath = function isoRouterGetRouteForPath (path) {
  return _.find(this.routes, caller('match', path))
}

if(Meteor.isServer) {
  IsoRouter.serve = function isoRouterServe (req, res, next) {
    this.currentRoute = this.getRouteForPath(req.url)
    if(!this.currentRoute) return next()
    if(this.currentRoute.serverValue) return this.currentRoute.serverValue(req, res, next)
    this.currentRoute
      .callAll('enter', this.currentRoute.parameters)
      .call('actionValue', parameters)
  }
  /* Install the global listener */
  WebApp.connectHandlers.use(IsoRouter.serve.bind(IsoRouter))
}

if(Meteor.isClient) {

  IsoRouter.serve = function isoRouterServe () {
    this.currentRoute = this.getRouteForPath(location.pathname)
    if(!this.currentRoute) return
    this.currentRoute
      .callAll('enter', this.currentRoute.parameters)
      .call('actionValue', parameters)
  }

  IsoRouter.exit = function () {
    console.log(this.currentRoute)
    if(this.currentRoute) this.currentRoute.callAll('exit')
  }

  addEventListener('load', IsoRouter.serve.bind(IsoRouter))
  addEventListener('isoRouter-enter', IsoRouter.exit.bind(IsoRouter))
  addEventListener('isoRouter-navigate', IsoRouter.serve.bind(IsoRouter))
}

function caller (key/*, args ... */) {
  var args = _.rest(arguments)
  return function (obj/*, rest ... */) {
    return obj[key].apply(obj, args.concat(_.rest(arguments)))
  }
}