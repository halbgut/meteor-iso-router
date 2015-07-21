IsoRouter = {}

IsoRouter.routes = []
IsoRouter.Route = Route
IsoRouter.navigate = navigate

/* This is to replace the connect handlers, next argument on the client-side */
IsoRouter.next = function next () {}


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

IsoRouter.exit = function () {
  if(this.currentRoute) this.currentRoute.callAll('exit')
}

IsoRouter.location = function (req) {
  return req ?
    req.url :
    location.pathname
}

IsoRouter.serve = function isoRouterServe () {
  var params = setConnectParams(arguments)
  this.currentRoute = this.getRouteForPath(this.location(params.req))
  if(!this.currentRoute) return params.next()
  if(Meteor.isServer) setConnectParams(arguments, this.currentRoute)
  this.currentRoute
    .callAll('enter', this.currentRoute.parameters)
    .call('action', parameters)
}

eventTarget.addEventListener(
  'load',
  IsoRouter.serve.bind(IsoRouter)
)

eventTarget.addEventListener(
  'isoRouter-enter',
  IsoRouter.exit.bind(IsoRouter)
)

eventTarget.addEventListener(
  'isoRouter-navigate',
  IsoRouter.serve.bind(IsoRouter)
)

if(Meteor.isServer) {
  /* Install the global listener */
  WebApp.connectHandlers.use(IsoRouter.serve.bind(IsoRouter))
}
