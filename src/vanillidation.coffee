utils = require './utils'


class Vanillidation
  constructor: (@form, opts) ->
    @validators = require './validators'
    @messages = require './messages'

    @rules = opts?.rules
    @fields = @form.querySelectorAll 'input[type="text"],input[type="password"],select,textarea'

    for elem in @fields
      @bindValidationEvents elem, @validateField

  validateField: (elem) =>
    name = elem.getAttribute 'name'
    rules = @rules?[name]
    return if not rules?

    if utils.isArray rules
      for r in rules
        console.log @validators[r]?(elem)
    else
      for r, opts of rules
        console.log @validators[r]?(elem, opts)

  bindValidationEvents: (elem, handler) ->
    elem.addEventListener 'blur', -> handler @
    elem.addEventListener 'keyup', -> handler @


module.exports = Vanillidation
