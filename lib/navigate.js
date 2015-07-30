if(Meteor.isClient) {
  /* Catch all click events and check if they should be intercepted */
  addEventListener('click', function (e) {
    if(!shouldPrevent(e.target, IsoRouter.location())) return
    e.preventDefault()
    /* If the default should be prevented, I internally move to the url in a anchor tag  */
    navigate(getHref(e.target))
    return false
  })
}

/* navigate(url)
 * Internally move to a certain url.
 */
navigate = function navigate (url) {
  eventTarget.dispatchEvent(navigate.enter)
  _.defer(function () {
    if(url) {
      if(Meteor.isClient) goTo(url, IsoRouter.newRoute)
      if(Meteor.isServer) redirect(url, IsoRouter.res)
    }
    if(!IsoRouter.res.finished) eventTarget.dispatchEvent(navigate.navigate)
  })
}

/**
 * Triggers when the client enters a route
 * @event isoRouter-enter
 */
navigate.enter = createEvent('isoRouter-enter', {})

/**
 * Triggers when the client has entered a route
 * @event isoRouter-navigate
 */
navigate.navigate = createEvent('isoRouter-navigate', {})

shouldPrevent = function shouldPrevent (element, location) {
  if(!element.parentNode) return false
  if(element.tagName === 'A') {
    var newHash = getHash(getPath(getHref(element)))
    if(
      element.getAttribute('download') ||
      (newHash && newHash === getHash(location))
    ) return false
    return true
  }
  if(shouldPrevent(element.parentNode)) return true
  return true
}

getPath = function (url) {
  var path = url.replace(/^(https?:\/\/)?(([\w\-_]+\.)*[\w\-_]+\.[\w\-_]+)/, '')
  return (path ? path : '/')
}

getHash = function (path) {
  return path.split('#')[1]
}

getHref = function getHref (element) {
  return element.href
}

goTo = function goTo (url) {
  history.pushState({}, '', url)
}

redirect = function redirect (url, res) {
  res.writeHead(302, {
    'Location': url
  })
  res.end('')
}
