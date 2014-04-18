module.exports = fn =
  required: (elem) ->
    if elem.tagName is 'INPUT' and elem.type is 'checkbox'
      elem.checked
    else
      elem.value? and elem.value != ''

  regex: (elem, expr) ->
    return expr.test elem.value

  email: (elem) ->
    return fn.regex elem, /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  minLength: (elem, len) ->
    if elem.tagName is 'INPUT' and elem.type is 'checkbox' or
        elem.tagName is 'SELECT'
      return true
    elem.value? and elem.value.length >= len

  digits: (elem) ->
    return fn.regex elem, /^\d+$/

  isASCII: (elem) ->
    return /^[\x00-\x7F]*$/.test elem.value
