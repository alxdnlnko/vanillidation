utils = require './utils'


class Vanillidation
  constructor: (@form, opts) ->
    @validators = require './validators'
    @messages = require './messages'
    @rules = opts?.rules ? {}
    @messagesOR = opts?.messages ? {}  # messages override
    @errors = {}

    fields = @getFields()
    for elem in fields
      @bindValidationEvents elem, @validateField

    @form.addEventListener 'submit', @validateForm

  getFields: () =>
    @form.querySelectorAll 'input:not([type="submit"]),select,textarea'

  validateForm: (ev) =>
    @validateField elem for elem in @getFields()
    if (Object.keys @errors).length
      ev.preventDefault()
      return false

  validateField: (elem) =>
    name = elem.name
    rules = @rules?[name]
    return if not rules?

    delete @errors[name] if name of @errors
    if utils.isArray rules
      for r in rules
        if not @validators[r]?(elem)
          @errors[name] = (@messagesOR[name]?[r] ? @messages[r]) ? 'Invalid data.'
          break
    else
      for r, opts of rules
        valid = true
        if typeof opts is 'function'
          valid = opts(elem)
        else
          valid = @validators[r]?(elem, opts)

        if not valid
          @errors[name] = (@messagesOR[name]?[r] ? @messages[r]) ? 'Invalid data.'
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
    if not (elem.tagName is 'INPUT' and elem.type is 'checkbox')
      elem.addEventListener 'blur', -> handler @

    self = @
    conditionalValidation = ->
      handler @ if @.name of self.errors

    elem.addEventListener 'keyup', conditionalValidation
    elem.addEventListener 'change', conditionalValidation


module.exports = Vanillidation
