utils = require './utils'


class Vanillidation
  constructor: (@form, opts) ->
    @validators = require './validators'
    @messages = require './messages'
    @rules = opts?.rules ? {}
    @errors = {}

    fields = @form.querySelectorAll 'input:not([type="submit"]),select,textarea'
    for elem in fields
      @bindValidationEvents elem, @validateField

  validateField: (elem) =>
    name = elem.name
    rules = @rules?[name]
    return if not rules?

    delete @errors[name] if name of @errors
    if utils.isArray rules
      for r in rules
        if not @validators[r]?(elem)
          @errors[name] = @messages[r] ? 'Invalid data.'
          break
    else
      for r, opts of rules
        if not @validators[r]?(elem)
          @errors[name] = @messages[r] ? 'Invalid data.'
          break

    @showFieldErrors elem

  showFieldErrors: (elem) =>
    error = @errors[elem.name]

    if error
      elem.parentNode.classList.add 'form-row--not-valid'
      ul = elem.parentNode.getElementsByClassName('errorlist')[0]
      if not ul
        ul = document.createElement 'ul'
        ul.className = 'errorlist';

      li = document.createElement 'li'
      li.appendChild document.createTextNode error
      ul.appendChild li

      elem.parentNode.appendChild ul

  bindValidationEvents: (elem, handler) ->
    elem.addEventListener 'blur', -> handler @

    self = @
    elem.addEventListener 'keyup', ->
      handler @ if @.name of self.errors


module.exports = Vanillidation
