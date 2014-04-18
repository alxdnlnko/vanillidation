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
