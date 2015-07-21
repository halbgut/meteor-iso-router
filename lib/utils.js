setConnectParams = function setConnectParams (params, obj) {
  obj = obj || {}
  obj.req = Meteor.isServer ? params[0] : false
  obj.res = Meteor.isServer ? params[1] : false
  obj.next = Meteor.isServer ? params[2] : function () {}
  return obj
}

caller = function caller (key/*, args ... */) {
  var args = _.rest(arguments)
  return function (obj/*, rest ... */) {
    return obj[key].apply(obj, args.concat(_.rest(arguments)))
  }
}

isCalledGlobal = function isCalledGlobal (globalObj) {
  return globalObj.isPrototypeOf(this) ? false : true
}
