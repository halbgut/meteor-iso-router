function isRoute (obj) {
  return IsoRouter.Route.__proto__.isPrototypeOf(obj)
}

Tinytest.add('API: IsoRouter.routes', function (test) {
  test.isTrue(_.isArray(IsoRouter.routes), 'IsoRouter.routes should be an array')
})

Tinytest.add('API: IsoRouter.route', function (test) {
  test.equal(typeof IsoRouter.route, 'function', 'IsoRouter should have a function route')
  test.isTrue(isRoute(IsoRouter.route('/testroute')), 'It should return a new route')
  test.equal(IsoRouter.route('/testroute').path, '/testroute', 'The newly created route should have a property that is equal to the passed path parameter')
  test.isTrue(isRoute(IsoRouter.routes[0]), 'It should push the new route to IsoRouter.routes')
  test.isTrue(IsoRouter.routes[0].path, 'It should set route.path')
  test.isTrue(IsoRouter.routes[0].pathRegex, 'It should set route.pathRegex')
})

Tinytest.add('API: IsoRouter.getRouteForUrl', function (test) {
  IsoRouter.route('/getRouteForUrl/test')
  IsoRouter.route('/getRouteForUrl/:variable/yolo')
  IsoRouter.route('/getRouteForUrl/trollz/yolo')
  IsoRouter.route('/getRouteForUrl/trollz/')
  test.equal(typeof IsoRouter.getRouteForUrl, 'function', 'IsoRouter should have a function getRouteForUrl')
  test.isTrue(isRoute(IsoRouter.getRouteForUrl('/getRouteForUrl/test')), 'It should return a route if it succeds')
  test.equal(IsoRouter.getRouteForUrl('/getRouteForUrl/adkdof'), {}, 'It should return the default route if no route exists for a url')
  test.equal(IsoRouter.getRouteForUrl('/getRouteForUrl/hi/yolo').path, '/getRouteForUrl/:variable/yolo')
  test.equal(IsoRouter.getRouteForUrl('/getRouteForUrl/trollz/yolo').path, '/getRouteForUrl/trollz/yolo')
})

