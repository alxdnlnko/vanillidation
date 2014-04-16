module.exports =
  isArray: (o) ->
    (Object::toString.call o) is '[object Array]'
