setConnectParams = function setConnectParams (params, obj) {
  obj = obj || {}
  obj.req = Meteor.isServer ? params[0] : false
  obj.res = Meteor.isServer ? params[1] : false
  obj.next = Meteor.isServer ? params[2] : function () {}
  return obj
}

