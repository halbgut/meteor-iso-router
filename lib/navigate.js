if(Meteor.isClient) {
  /* Catch all click events and check if they should be intercepted */
  addEventListener('click', function (e) {
    /* Filter out any right clicks */
    if(e.which === 3) return
    var newUrl = shouldPrevent(e.target, location.href)
    if(!newUrl) return
    e.preventDefault()

    navigate(newUrl)
    return false
  })
}

/* navigate(url)
 * Internally move to a certain url.
 */
navigate = function navigate (url, e) {
  IsoRouter.dispatchExit()
  _.defer(() => {
    if(Meteor.isClient) {
      goTo(url)
      IsoRouter.dispatchEnter()
    } else {
      redirect(url, e.res)
    }
  })
}

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
  return shouldPrevent(element.parentNode, oldUrl)
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
