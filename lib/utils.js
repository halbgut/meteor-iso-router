setParams = function setParams (params, obj) {
  obj = obj || {}
  obj.req = Meteor.isServer ? params[0] || params.req : {}
  obj.res = Meteor.isServer ? params[1] || params.res : {}
  obj.next = Meteor.isServer ? params[2] || params.next : function () {}
  return obj
}

caller = function caller (key/*, args ... */) {
  var args = _.rest(arguments)
  return function (obj/*, rest ... */) {
    return obj[key].apply(obj, args.concat(_.rest(arguments)))
  }
}

isCalledGlobal = function isCalledGlobal (globalObj) {
  return globalObj.isPrototypeOf(this) ? true : false
}
