module.exports = fn =
  required: (elem) ->
    return elem.value? and elem.value != ''

  regex: (elem, expr) ->
    return expr.test elem.value

  email: (elem) ->
    return fn.regex elem, /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
