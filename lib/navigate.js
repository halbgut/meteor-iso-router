function navigate (url) {
  eventTarget.dispatchEvent(navigate.enter)
  _.defer(function () {
    if(Meteor.isClient) goTo(url, this.newRoute)
    if(Meteor.isServer) redirect(url, this.res)
    eventTarget.dispatchEvent(navigate.navigate)
  })
}

if(Meteor.isClient) {
  addEventListener('click', function (e) {
    if(!shouldPrevent(e.target)) return
    e.preventDefault()
    navigate(getHref(e.target))
  })
}

function shouldPrevent (element) {
  if(element.tagName !== 'A') return false
  if(element.getAttribute('download')) return false
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
}

navigate.enter = createEvent('isoRouter-enter', {})
navigate.navigate = createEvent('isoRouter-navigate', {})
