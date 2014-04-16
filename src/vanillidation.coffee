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
      created = false
      ul = elem.parentNode.getElementsByClassName('errorlist')[0]
      if not ul
        ul = document.createElement 'ul'
        ul.className = 'errorlist';
        created = true
      else
        ul.removeChild ul.firstChild while ul.firstChild

      li = document.createElement 'li'
      li.appendChild document.createTextNode error
      ul.appendChild li

      if created
        elem.parentNode.appendChild ul
      else
        ul.style.display = 'block'
    else
      elem.parentNode.classList.remove 'form-row--not-valid'
      ul = elem.parentNode.getElementsByClassName('errorlist')[0]
      ul.style.display = 'none' if ul?

  bindValidationEvents: (elem, handler) ->
    elem.addEventListener 'blur', -> handler @

    self = @
    elem.addEventListener 'keyup', ->
      handler @ if @.name of self.errors


module.exports = Vanillidation
