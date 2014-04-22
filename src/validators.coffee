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

  creditCard: (elem, typeElem) ->
    checkType = false
    if typeElem and (type = typeElem.value)
      type = type.toLowerCase()
      checkType = true

    val = elem.value
    return false if not val?

    val = val.replace /[- ]/g, ''
    return false if not /^\d+$/.test val

    total = 0
    for i in [(val.length - 1)..0]
      n = +val[i]
      if (i + val.length) % 2 == 0
        n = if n * 2 > 9 then n * 2 - 9 else n * 2
      total += n
    return false if total % 10 != 0

    return true if not checkType
    if type is 'mastercard'
      /^5[1-5].{14}$/.test val
    else if type is 'visa'
      /^4.{15}$|^4.{12}$/.test val
    else if type is 'amex'
      /^3[47].{13}$/.test val
    else if type is 'discover'
      /^6011.{12}$/.test val
    else
      false

  creditCardExpireDate: (elem) ->
    return false if not fn.regex elem, /\d{2}\/\d{4}/
    [month, year] = elem.value.split('/')

    now = new Date()
    return now.getFullYear() < +year and 1 <= +month <= 12 or
      now.getFullYear() == +year and now.getMonth() + 1 < +month <= 12
