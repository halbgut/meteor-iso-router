if(Meteor.isClient) {
  var hashchangeEvent = new CustomEvent('hashchange', {})
  /* Catch all click events and check if they should be intercepted */
  addEventListener('click', function (e) {
    if(e.which === 3) return
    var oldUrl = IsoRouter.location()
    var newUrl = shouldPrevent(
      e.target,
      oldUrl
    )
    if(!newUrl) return
    e.preventDefault()
    if(
      getCleanPath(oldUrl) === getCleanPath(newUrl) &&
      getHash(oldUrl) !== undefined &&
      getHash(newUrl) === undefined
    ) {
      window.dispatchEvent(hashchangeEvent)
      goTo(newUrl)
    } else {
      /* If the default should be prevented, I internally move to the url in a anchor tag  */
      IsoRouter.currentRoute.get().navigate(newUrl)
    }
    return false
  })
}

/* navigate(url)
 * Internally move to a certain url.
 */
navigate = function navigate (url) {
  eventTarget.dispatchEvent(navigate.enter)
  _.defer(() => {
    Meteor.isClient
     ? goTo(url)
     : redirect(url, this.res)
    eventTarget.dispatchEvent(navigate.navigate)
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
  return (
    getLocation(oldUrl) === getLocation(newUrl) &&
    getCleanPath(oldUrl) === getCleanPath(newUrl) &&
    getHash(newUrl) !== undefined &&
    getHash(oldUrl) !== getHash(newUrl)
  )
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
