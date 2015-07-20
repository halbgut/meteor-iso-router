function navigate (url) {
  navigate.eventTarget.dispatchEvent(navigate.enter)
  _.defer(function () {
    if(Meteor.isClient) goTo(url, this.newRoute)
    if(Meteor.isServer) redirect(url, this.res)
    navigate.eventTarget.dispatchEvent(navigate.navigate)
  })
}

if(Meteor.isClient) {
  addEventListener('click', function (e) {
    if(!shouldPrevent(e.target)) return
    e.preventDefault()
    navigate(getHref(e.target))
  })
  navigate.eventTarget = window
}

if(Meteor.isServer) {
  var events = Npm.require('events')
  function CustomEvent (name, data) {
    this.eventName = name
    this.eventData = (data && data.detail) ? data.detail : {}
  }
  navigate.eventTarget = new events.EventEmitter
  navigate.eventTarget.dispatchEvent = navigate.eventTarget.emit
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

navigate.enter = new CustomEvent('isoRouter-enter', {})
navigate.navigate = new CustomEvent('isoRouter-navigate', {})
