utils = require './utils'


class Vanillidation
  constructor: (@form, opts) ->
    @validators = require './validators'
    @messages = require './messages'
    @rules = opts?.rules ? {}
    @messagesOR = opts?.messages ? {}  # messages override
    @errors = {}

    defaults =
      errorClass: 'has-error'
      classToParent: false
      errorListClass: 'errorlist'

    @settings = utils.override defaults, opts ? {}

    fields = @getFields()
    for elem in fields
      @bindValidationEvents elem, @validateField

    @form.addEventListener 'submit', @validateForm

  getFields: () =>
    @form.querySelectorAll 'input:not([type="submit"]),select,textarea'

  validateForm: (ev) =>
    delete @errors['__form__'] if '__form__' of @errors
    @validateField elem for elem in @getFields()
    if (Object.keys @errors).length
      console.log 'asdfasdf'
      @errors['__form__'] = @messagesOR['__form__'] ? @messages['__form__']
      @showFormErrors()
      ev.preventDefault()
      return false

  showFormErrors: () =>
    error = @errors['__form__']
    if error
      created = false
      ul = @form.getElementsByClassName('form-errors')[0]
      if not ul
        ul = document.createElement 'ul'
        ul.className = @settings.errorListClass + ' form-errors'
        created = true
      else
        ul.removeChild ul.firstChild while ul.firstChild

      li = document.createElement 'li'
      li.appendChild document.createTextNode error
      ul.appendChild li

      if created
        @form.insertBefore ul, @form.firstChild
      else
        ul.style.display = 'block'
    else
      ul = @form.getElementsByClassName('form-errors')[0]
      ul.style.display = 'none' if ul?

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
        valid = if typeof opts is 'function' then opts(elem) else @validators[r]?(elem, opts)

        if not valid
          @errors[name] = (@messagesOR[name]?[r] ? @messages[r]) ? 'Invalid data.'
          break

    @showFieldErrors elem

  showFieldErrors: (elem) =>
    error = @errors[elem.name]

    if error
      (if @settings.classToParent then elem.parentNode else elem).classList.add @settings.errorClass
      created = false
      ul = elem.parentNode.getElementsByClassName(@settings.errorListClass)[0]
      if not ul
        ul = document.createElement 'ul'
        ul.className = @settings.errorListClass
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
      (if @settings.classToParent then elem.parentNode else elem).classList.remove @settings.errorClass
      ul = elem.parentNode.getElementsByClassName(@settings.errorListClass)[0]
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
