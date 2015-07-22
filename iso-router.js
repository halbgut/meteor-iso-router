/**
 * @namespace
 */
IsoRouter = {}

/**
 * All routes are saved inside this object
 * @locus anywhere
 * @type {array.<Route>}
 */
IsoRouter.routes = []

/**
 * The prototype of all routes
 * @locus anywhere
 * @type {object}
 */
IsoRouter.Route = Route

/**
 * The navigate function
 * @locus anywhere
 * @type {function}
 * @param {string} url - The url to navigate to
 */
IsoRouter.navigate = navigate

/**
 * This is to replace the connect handlers, next argument on the client-side
 * @locus anywhere
 * @type {function}
 */
IsoRouter.next = function next () {}


/**
 * Creates a new iso-router route
 * @param {string} path - The path-to-regex path the route is for
 * @return {Route} The newly created route
 */
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

/**
 * Returns the first route with a path matching the passed url
 * @locus anywhere
 * @param {string} - A relative url
 * @return {Route} The matching route
 */
IsoRouter.getRouteForUrl = function isoRouterGetRouteForUrl (url) {
  return _.find(this.routes, caller('match', url))
}

IsoRouter.exit = function () {
  if(this.currentRoute) this.currentRoute.callAll('exit')
}

IsoRouter.location = function (req) {
  return req ?
    req.url :
    location.pathname
}

/**
 * Serves a route. It first sets all connectHandle properties (req, res, next). Then it get's the current location and a matching route. If there's not route for the url `next` is called.
 * @locus anywhere
 * @return {{ ?req: connectHandle.req, ?res: connectHandle.res, ?next: connectHandle.next }} IsoRouter
 */
IsoRouter.serve = function isoRouterServe () {
  var params = setConnectParams(arguments)
  this.currentRoute = this.getRouteForUrl(this.location(params.req))
  if(!this.currentRoute) return params.next()
  if(Meteor.isServer) setConnectParams(arguments, this.currentRoute)
  this.currentRoute.parameters = this.currentRoute.match(this.location(params.req))
  this.currentRoute
    .callAll('enter', this.currentRoute.parameters)
    .call('action', this.currentRoute.parameters)
  return this
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
