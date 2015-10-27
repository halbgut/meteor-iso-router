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
  if(Meteor.isClient) {
    IsoRouter.navigate('/test')
    _.defer(function () {
      test.isTrue(IsoRouter.location().indexOf('/test') > -1, 'IsoRouter should change the location to the passed argument')
      done()
    })
  } else done()
})

if(Meteor.isClient) {
  Tinytest.add('shouldPrevent', function (test) {
    test.equal(typeof IsoRouter.navigate, 'function', 'There should be a function `shouldPrevent`')
    var simpleAnchor = elemStub({
      tagName: 'A',
      href: '/'
    })
    test.isTrue(shouldPrevent(simpleAnchor, '/'), 'It should return true if an a tag is passed')
    var downloadAnchor = elemStub({
      tagName: 'A',
      href:  '/',
      download: true
    })
    test.isFalse(shouldPrevent(downloadAnchor, '/'), 'It should return false if the passed element has the download property set')
    var elementInsideAnchor = elemStub({
      tagName: 'IMG',
      parentNode: elemStub({
        tagName: 'DIV',
        parentNode: elemStub({
          href: '/',
          tagName: 'A'
        })
      })
    })
    test.isTrue(shouldPrevent(elementInsideAnchor, '/'), 'It should return true if one the passed element has an anchor as a parent')
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

Tinytest.add('getPath', function (test) {
  test.equal(getPath('http://tro.lololo.lo/asdf'), '/asdf', 'It should return the path name of a URL')
  test.equal(getPath('http://tro.lololo.lo'), '/', 'It should return / if there\'s not path')
    test.equal(getPath('trollolo.co/tet?q=1#asd'), '/tet?q=1#asd', 'It should also return the query string and hashfrags')
    test.equal(getPath('/tet?q=1#asd'), '/tet?q=1#asd', 'It should be able to handle relative urls')
    test.equal(getPath('#asd'), '#asd', 'It should be able to handle relative urls')
})

