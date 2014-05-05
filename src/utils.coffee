module.exports =
  isArray: (o) ->
    (Object::toString.call o) is '[object Array]'

  extend: (target, objects...) ->
    for obj in objects
      for key, value of obj
        target[key] = value
    target

  override: (target, objects...) ->
    for obj in objects
      for key, value of obj
        target[key] = value if key of target
    target

  fireEvent: (elem, eventName) ->
    return if not elem? or not eventName?
    if document.createEvent?
      ev = document.createEvent 'HTMLEvents'
      ev.initEvent eventName, false, true
      elem.dispatchEvent ev
    else if document.createEventObject?
      ev = document.createEventObject()
      elem.fireEvent eventName, ev
