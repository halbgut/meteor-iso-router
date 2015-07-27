/**
 * This is the only object exported by this package. It contains all it's the API.
 * @locus anywhere
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
 * The prototype of all routes. You can access it to set global defaults. See {@link Route.enter}, {@link Route.action} and {@link Route.exit}.
 * @locus anywhere
 * @type {object}
 */
IsoRouter.Route = Route

/**
 * With this function you can navigate to a cerain URL. You can't simply do a `location.href = '/internal/url'`. This will initiate a new HTTP request to that location. You have to go through this function. Server-side, this function does a [302]{@link https://tools.ietf.org/html/rfc7231#section-6.4.3} _redirect_. So you could use it for a moved page. When you URL schema changes you can simply use this to dynamically redirect the client. The URL is passed to the client by setting the `Location`-header. The function is called asynchronously using `_.defer`.
 * @function
 * @locus anywhere
 * @param {string} url - The url to navigate to
 * @param {301|302|307} [statusCode=302] - HTTP status code to respond with.
 */
IsoRouter.navigate = navigate

/*
 * This is to replace the connect handlers, next argument on the client-side.
 * @locus server
 * @type {function}
 */
IsoRouter.next = function next () {}


/**
 * Creates a new iso-router route. It's created with {@link Route} as its prototype.
 * @locus client
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
 * Returns the first route with a path matching the passed url.
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
