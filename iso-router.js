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
 * The route the client is currently on. This is a reac
 * @locus client
 * @type {ReactiveVar.<Route>}
 */
if(Meteor.isClient) IsoRouter.currentRoute = new ReactiveVar()

IsoRouter.events = {
  enter: 'isoRouter-enter',
  exit: 'isoRouter-exit'
}

/**
 * The prototype of all routes. You can access it to set global defaults. See {@link Route.enter}, {@link Route.action} and {@link Route.exit}.
 * @locus anywhere
 * @type {object}
 */
IsoRouter.Route = Object.create(Route)
// TODO: Document this *really* well. It would be nicer if I didn't have to do this
_.defer(() => {
  IsoRouter.Route.addListener('enter', (e) => {
    // TODO: Check wether or not the headers have been sent
    if(e.next) e.next()
  })
})

if(Meteor.isClient) {
  IsoRouter.Route.addListener('enter', (e) => {
    IsoRouter.currentRoute.set(e.route)
  })
}

/**
 * With this function you can navigate to a cerain URL. You can't simply do a `location.href = '/internal/url'`. This will initiate a new HTTP request to that location. You have to go through this function. Server-side, this function does a [302]{@link https://tools.ietf.org/html/rfc7231#section-6.4.3} _redirect_. So you could use it for a moved page. When you URL schema changes you can simply use this to dynamically redirect the client. The URL is passed to the client by setting the `Location`-header. The function is called asynchronously using `_.defer`.
 * @function
 * @locus anywhere
 * @param {string} url - The url to navigate to
 * @param {navigateEvent} navigateEvent - Required on the server side
 */
IsoRouter.navigate = navigate

/**
 * Creates a new iso-router route. It's created with {@link Route} as its prototype.
 * @locus client
 * @param {string} path - The path-to-regex path the route is for
 * @return {Route} The newly created route
 */
IsoRouter.route = function isoRouterRoute (path) {
  var keys = []
  return (
    this.routes[this.routes.push(Object.create(Route)) - 1]
      .set('path', path)
      .set('pathRegex', function () {
        return pathToRegexp(path, keys)
      })
      .set('keys', keys)
  )
}

/**
 * Returns the first route with a path matching the passed url.
 * @locus anywhere
 * @param {string} - A relative url
 * @return {Route} The matching route
 */
IsoRouter.getRouteForUrl = function isoRouterGetRouteForUrl (url) {
  return (
    _.last(
      _.filter(
        this.routes,
        caller('match', getCleanPath(url))
      )
    )
    || this.Route
  )
}

IsoRouter.location = function IsoRouterLocation (req) {
  return (req && req.url) || location.href
}

/**
 * Triggers when the client enters a route
 * @event isoRouter-enter
 */
IsoRouter.dispatchEnter = function IsoRouterDispatchEnter (request, response, next) {
  dispatchEvent(IsoRouter.events.enter, generateEventParameters.apply(null, arguments))
}

/**
 * Triggers when the client has entered a route
 * @event isoRouter-exit
 */
IsoRouter.dispatchExit = function IsoRouterDispatchExit (request, response, next) {
  dispatchEvent(IsoRouter.events.exit, generateEventParameters.apply(null, arguments))
}


eventTarget.addEventListener(
  'load',
  IsoRouter.dispatchEnter
)

if(Meteor.isServer) {
  /* Install the global listener */
  WebApp.connectHandlers.use(IsoRouter.dispatchEnter)
}

