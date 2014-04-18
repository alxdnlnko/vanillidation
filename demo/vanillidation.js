(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        window.Vanillidation = factory();
    }
})(function() {
    return require('./vanillidation');
});

},{"./vanillidation":5}],2:[function(require,module,exports){
module.exports = {
  __form__: 'Please, correct the errors below.',
  required: 'This field is required.',
  regex: 'The value doesn\'t match the format.',
  email: 'Enter a valid e-mail address.',
  minLength: 'The value is too short.'
};


},{}],3:[function(require,module,exports){
var __slice = [].slice;

module.exports = {
  isArray: function(o) {
    return (Object.prototype.toString.call(o)) === '[object Array]';
  },
  extend: function() {
    var key, obj, objects, target, value, _i, _len;
    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      obj = objects[_i];
      for (key in obj) {
        value = obj[key];
        target[key] = value;
      }
    }
    return target;
  },
  override: function() {
    var key, obj, objects, target, value, _i, _len;
    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      obj = objects[_i];
      for (key in obj) {
        value = obj[key];
        if (key in target) {
          target[key] = value;
        }
      }
    }
    return target;
  }
};


},{}],4:[function(require,module,exports){
var fn;

module.exports = fn = {
  required: function(elem) {
    if (elem.tagName === 'INPUT' && elem.type === 'checkbox') {
      return elem.checked;
    } else {
      return (elem.value != null) && elem.value !== '';
    }
  },
  regex: function(elem, expr) {
    return expr.test(elem.value);
  },
  email: function(elem) {
    return fn.regex(elem, /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  },
  minLength: function(elem, len) {
    if (elem.tagName === 'INPUT' && elem.type === 'checkbox' || elem.tagName === 'SELECT') {
      return true;
    }
    return (elem.value != null) && elem.value.length >= len;
  }
};


},{}],5:[function(require,module,exports){
var Vanillidation, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('./utils');

Vanillidation = (function() {
  function Vanillidation(form, opts) {
    var defaults, elem, fields, _i, _len, _ref, _ref1;
    this.form = form;
    this.showFieldErrors = __bind(this.showFieldErrors, this);
    this.validateField = __bind(this.validateField, this);
    this.showFormErrors = __bind(this.showFormErrors, this);
    this.validateForm = __bind(this.validateForm, this);
    this.getFields = __bind(this.getFields, this);
    this.validators = require('./validators');
    this.messages = require('./messages');
    this.rules = (_ref = opts != null ? opts.rules : void 0) != null ? _ref : {};
    this.messagesOR = (_ref1 = opts != null ? opts.messages : void 0) != null ? _ref1 : {};
    this.errors = {};
    defaults = {
      errorClass: 'has-error',
      classToParent: false,
      errorListClass: 'errorlist'
    };
    this.settings = utils.override(defaults, opts != null ? opts : {});
    fields = this.getFields();
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      elem = fields[_i];
      this.bindValidationEvents(elem, this.validateField);
    }
    this.form.addEventListener('submit', this.validateForm);
  }

  Vanillidation.prototype.getFields = function() {
    return this.form.querySelectorAll('input:not([type="submit"]),select,textarea');
  };

  Vanillidation.prototype.validateForm = function(ev) {
    var elem, _i, _len, _ref, _ref1;
    if ('__form__' in this.errors) {
      delete this.errors['__form__'];
    }
    _ref = this.getFields();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      this.validateField(elem);
    }
    if ((Object.keys(this.errors)).length) {
      console.log('asdfasdf');
      this.errors['__form__'] = (_ref1 = this.messagesOR['__form__']) != null ? _ref1 : this.messages['__form__'];
      this.showFormErrors();
      ev.preventDefault();
      return false;
    }
  };

  Vanillidation.prototype.showFormErrors = function() {
    var created, error, li, ul;
    error = this.errors['__form__'];
    if (error) {
      created = false;
      ul = this.form.getElementsByClassName('form-errors')[0];
      if (!ul) {
        ul = document.createElement('ul');
        ul.className = this.settings.errorListClass + ' form-errors';
        created = true;
      } else {
        while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }
      }
      li = document.createElement('li');
      li.appendChild(document.createTextNode(error));
      ul.appendChild(li);
      if (created) {
        return this.form.insertBefore(ul, this.form.firstChild);
      } else {
        return ul.style.display = 'block';
      }
    } else {
      ul = this.form.getElementsByClassName('form-errors')[0];
      if (ul != null) {
        return ul.style.display = 'none';
      }
    }
  };

  Vanillidation.prototype.validateField = function(elem) {
    var name, opts, r, rules, valid, _base, _base1, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    name = elem.name;
    rules = (_ref = this.rules) != null ? _ref[name] : void 0;
    if (rules == null) {
      return;
    }
    if (name in this.errors) {
      delete this.errors[name];
    }
    if (utils.isArray(rules)) {
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        r = rules[_i];
        if (!(typeof (_base = this.validators)[r] === "function" ? _base[r](elem) : void 0)) {
          this.errors[name] = (_ref1 = (_ref2 = (_ref3 = this.messagesOR[name]) != null ? _ref3[r] : void 0) != null ? _ref2 : this.messages[r]) != null ? _ref1 : 'Invalid data.';
          break;
        }
      }
    } else {
      for (r in rules) {
        opts = rules[r];
        valid = typeof opts === 'function' ? opts(elem) : typeof (_base1 = this.validators)[r] === "function" ? _base1[r](elem, opts) : void 0;
        if (!valid) {
          this.errors[name] = (_ref4 = (_ref5 = (_ref6 = this.messagesOR[name]) != null ? _ref6[r] : void 0) != null ? _ref5 : this.messages[r]) != null ? _ref4 : 'Invalid data.';
          break;
        }
      }
    }
    return this.showFieldErrors(elem);
  };

  Vanillidation.prototype.showFieldErrors = function(elem) {
    var created, error, li, ul;
    error = this.errors[elem.name];
    if (error) {
      (this.settings.classToParent ? elem.parentNode : elem).classList.add(this.settings.errorClass);
      created = false;
      ul = elem.parentNode.getElementsByClassName(this.settings.errorListClass)[0];
      if (!ul) {
        ul = document.createElement('ul');
        ul.className = this.settings.errorListClass;
        created = true;
      } else {
        while (ul.firstChild) {
          ul.removeChild(ul.firstChild);
        }
      }
      li = document.createElement('li');
      li.appendChild(document.createTextNode(error));
      ul.appendChild(li);
      if (created) {
        return elem.parentNode.appendChild(ul);
      } else {
        return ul.style.display = 'block';
      }
    } else {
      (this.settings.classToParent ? elem.parentNode : elem).classList.remove(this.settings.errorClass);
      ul = elem.parentNode.getElementsByClassName(this.settings.errorListClass)[0];
      if (ul != null) {
        return ul.style.display = 'none';
      }
    }
  };

  Vanillidation.prototype.bindValidationEvents = function(elem, handler) {
    var conditionalValidation, self;
    if (!(elem.tagName === 'INPUT' && elem.type === 'checkbox')) {
      elem.addEventListener('blur', function() {
        return handler(this);
      });
    }
    self = this;
    conditionalValidation = function() {
      if (this.name in self.errors) {
        return handler(this);
      }
    };
    elem.addEventListener('keyup', conditionalValidation);
    return elem.addEventListener('change', conditionalValidation);
  };

  return Vanillidation;

})();

module.exports = Vanillidation;


},{"./messages":2,"./utils":3,"./validators":4}]},{},[1])