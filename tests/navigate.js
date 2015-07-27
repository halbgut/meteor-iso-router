function elemStub (attributes) {
  if(!attributes) return {}
  return _.extend({
    getAttribute: function (key) {
      return attributes[key]
    },
    parentNode: elemStub()
  }, attributes)
}

Tinytest.addAsync('IsoRouter.navigate', function (test, done) {
  test.equal(typeof IsoRouter.navigate, 'function', 'IsoRouter should have a property navigate which is a function')
  if(Meteor.isClient) {
    IsoRouter.navigate('/test')
    _.defer(function () {
      test.equal(IsoRouter.location(), '/test', 'IsoRouter should change the location to the passed argument')
    })
    HTTP.get('/redirect_me', function (err, res) {
      test.equal(res.content, 'HiLo', 'It should do a redirect server-side.')
      done()
    })
  } else {
    IsoRouter.route('/redirect_me')
      .action(function () {
        IsoRouter.navigate('/downlow')
      })
    IsoRouter.route('/downlow')
      .action (function () {
        this.res.end('HiLo')
      })
    done()
  }
})

if(Meteor.isClient) {
  Tinytest.add('shouldPrevent', function (test) {
    test.equal(typeof IsoRouter.navigate, 'function', 'There should be a function `shouldPrevent`')
    var simpleAnchor = elemStub({
      tagName: 'A'
    })
    test.isTrue(shouldPrevent(simpleAnchor), 'It should return true if an a tag is passed')
    var downloadAnchor = elemStub({
      tagName: 'A',
      download: true
    })
    test.isFalse(shouldPrevent(downloadAnchor), 'It should return false if the passed element has the download property set')
    var elementInsideAnchor = elemStub({
      tagName: 'IMG',
      parentNode: elemStub({
        tagName: 'DIV',
        parentNode: elemStub({
          tagName: 'A'
        })
      })
    })
    test.isTrue(shouldPrevent(elementInsideAnchor), 'It should return true if one the passed element has an anchor as a parent')
  })

  Tinytest.add('getHref', function (test) {
    test.equal(getHref({href: 'test'}), 'test', 'getHref should simply return the href propery of an object')
  })

  Tinytest.addAsync('goTo', function (test, done) {
    goTo('/testGoTo')
    _.defer(function () {
      test.equal(location.pathname, '/testGoTo', 'goTo should change the route to the passed argument without reloading the page')
      done()
    })
  })
}

if(Meteor.isServer) {
  Tinytest.add('redirect', function (test) {
    var resStub = {
      writeHead: function (statusCode, headers) {
        this.headers = headers
        this.statusCode = statusCode
      },
      end: function (str) {
        this.ended = str
      }
    }
    redirect('test', resStub)
    test.equal(resStub.statusCode, 302, 'It should set the statusCode to 302')
    test.equal(resStub.headers.Location, 'test', 'It should set the location header field to the first argument passed')
    test.equal(resStub.ended, '', 'It should send back an empty payload')
  })
}
