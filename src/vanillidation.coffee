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
      showFormErrors: true
      conditional: {}
      dependencies: {}

    @settings = utils.override defaults, opts ? {}

    @fields = {}
    @fields[f.name] = f for f in @getFields()

    @bindValidationEvents name, elem, @validateField for name, elem of @fields

    @form.setAttribute 'novalidate', 'novalidate'
    @form.addEventListener 'submit', @validateForm

  getFields: () =>
    @form.querySelectorAll 'input:not([type="submit"]),select,textarea'

  validateForm: (ev) =>
    delete @errors['__form__'] if '__form__' of @errors
    @validateField elem for name, elem of @fields
    if (Object.keys @errors).length
      @errors['__form__'] = @messagesOR['__form__'] ? @messages['__form__']
      @showFormErrors()
      ev.preventDefault()
      return false

  showFormErrors: () =>
    if not @settings.showFormErrors
      return

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

    if (condition = @settings.conditional?[name])?
      if typeof condition is 'function' and not condition() or @errors[condition]
        delete @errors[name] if name of @errors
        @showFieldErrors elem
        return true

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

  bindValidationEvents: (name, elem, handler) ->
    if not (elem.tagName is 'INPUT' and elem.type is 'checkbox')
      elem.addEventListener 'blur', -> handler @

    self = @
    conditionalValidation = ->
      # only if invalid now
      handler @ if @.name of self.errors

    elem.addEventListener 'keyup', conditionalValidation
    elem.addEventListener 'change', conditionalValidation

    if name of @settings.dependencies
      for dep in @settings.dependencies[name]
        depElem = @fields[dep]
        depElem.addEventListener 'change', ->
          handler elem

          # if document.createEvent?
          #   ev = document.createEvent 'HTMLEvents'
          #   ev.initEvent 'change', false, true
          #   elem.dispatchEvent ev
          # else if document.createEventObject?
          #   ev = document.createEventObject()
          #   elem.fireEvent 'onchange', ev


module.exports = Vanillidation
