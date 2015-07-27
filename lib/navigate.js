if(Meteor.isClient) {
  /* Catch all click events and check if they should be intercepted */
  addEventListener('click', function (e) {
    if(!shouldPrevent(e.target)) return
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

function shouldPrevent (element) {
  if(element.getAttribute('download')) return false
  if(element.tagName === 'A') return true
  if(shouldPrevent(element.parentNode)) return true
  return true
}

function getHref (element) {
  return element.href
}

function goTo (url) {
  history.pushState({}, '', url)
}

function redirect (url, res) {
  res.writeHead(302, {
    'Location': url
  })
  res.end('')
}
