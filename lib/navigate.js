if(Meteor.isClient) {
  /* Catch all click events and check if they should be intercepted */
  addEventListener('click', function (e) {
    var url = shouldPrevent(e.target, IsoRouter.location())
    if(!url) return
    e.preventDefault()
    /* If the default should be prevented, I internally move to the url in a anchor tag  */
    navigate(url)
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

shouldPrevent = function shouldPrevent (element, oldUrl) {
  var newUrl
  if(!element.parentNode) return false
  if(isATag(element)) {
    newUrl = getHref(element)
    if(
      element.getAttribute('download') ||
      !isTargetLocal(oldUrl, newUrl) ||
      isHashChange(oldUrl, newUrl)
    ) return false
    return newUrl
  }
  if((newUrl = shouldPrevent(element.parentNode, oldUrl))) return newUrl
  return false
}

isATag = function isATag (elem) {
  return (
    elem.tagName === 'A' &&
    getHref(elem)
  )
}

isTargetLocal = function isTargetLocal (oldUrl, newUrl) {
  return getLocation(oldUrl) === getLocation(newUrl)
}

isHashChange = function isHashChange (oldUrl, newUrl) {
  return getHash(oldUrl) !== getHash(newUrl)
}

locationRegex = /((https?)?:\/\/)([\w\.\-_]+)/

getLocation = function getLocation (url) {
  var match = url.match(locationRegex)
  return match && match[3]
}

getPath = function getPath (url) {
  var path = url.replace(locationRegex, '')
  return (path ? path : '/')
}

getHash = function getHash (path) {
  return path.split('#')[1]
}

getHref = function getHref (element) {
  return element.href ? element.href : false
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
