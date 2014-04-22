(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(factory) {
    if(!(typeof document.getElementsByClassName === 'function' &&
        typeof document.querySelectorAll === 'function')) {
        factory = function() {
            return function() {};
        };
    }

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
  minLength: 'The value is too short.',
  digits: 'This field can contain digits only.',
  isASCII: 'Please, don\'t use non-latin letters.',
  creditCard: 'Invalid credit card number.'
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
  },
  digits: function(elem) {
    return fn.regex(elem, /^\d+$/);
  },
  isASCII: function(elem) {
    return /^[\x00-\x7F]*$/.test(elem.value);
  },
  creditCard: function(elem, typeElem) {
    var checkType, i, n, total, type, val, _i, _ref;
    checkType = false;
    if (typeElem && (type = typeElem.value)) {
      type = type.toLowerCase();
      checkType = true;
    }
    val = elem.value;
    if (val == null) {
      return false;
    }
    val = val.replace(/[- ]/g, '');
    if (!/^\d+$/.test(val)) {
      return false;
    }
    total = 0;
    for (i = _i = _ref = val.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      n = +val[i];
      if ((i + val.length) % 2 === 0) {
        n = n * 2 > 9 ? n * 2 - 9 : n * 2;
      }
      total += n;
    }
    if (total % 10 !== 0) {
      return false;
    }
    if (!checkType) {
      return true;
    }
    if (type === 'mastercard') {
      return /^5[1-5].{14}$/.test(val);
    } else if (type === 'visa') {
      return /^4.{15}$|^4.{12}$/.test(val);
    } else if (type === 'amex') {
      return /^3[47].{13}$/.test(val);
    } else if (type === 'discover') {
      return /^6011.{12}$/.test(val);
    } else {
      return false;
    }
  }
};


},{}],5:[function(require,module,exports){
var Vanillidation, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('./utils');

Vanillidation = (function() {
  function Vanillidation(form, opts) {
    var defaults, elem, f, name, _i, _len, _ref, _ref1, _ref2, _ref3;
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
      errorListClass: 'errorlist',
      conditional: {},
      dependencies: {}
    };
    this.settings = utils.override(defaults, opts != null ? opts : {});
    this.fields = {};
    _ref2 = this.getFields();
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      f = _ref2[_i];
      this.fields[f.name] = f;
    }
    _ref3 = this.fields;
    for (name in _ref3) {
      elem = _ref3[name];
      this.bindValidationEvents(name, elem, this.validateField);
    }
    this.form.setAttribute('novalidate', 'novalidate');
    this.form.addEventListener('submit', this.validateForm);
  }

  Vanillidation.prototype.getFields = function() {
    return this.form.querySelectorAll('input:not([type="submit"]),select,textarea');
  };

  Vanillidation.prototype.validateForm = function(ev) {
    var elem, name, _ref, _ref1;
    if ('__form__' in this.errors) {
      delete this.errors['__form__'];
    }
    _ref = this.fields;
    for (name in _ref) {
      elem = _ref[name];
      this.validateField(elem);
    }
    if ((Object.keys(this.errors)).length) {
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
    var condition, name, opts, r, rules, valid, _base, _base1, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    name = elem.name;
    rules = (_ref = this.rules) != null ? _ref[name] : void 0;
    if (rules == null) {
      return;
    }
    if ((condition = (_ref1 = this.settings.conditional) != null ? _ref1[name] : void 0) != null) {
      if (typeof condition === 'function' && !condition() || this.errors[condition]) {
        if (name in this.errors) {
          delete this.errors[name];
        }
        this.showFieldErrors(elem);
        return true;
      }
    }
    if (name in this.errors) {
      delete this.errors[name];
    }
    if (utils.isArray(rules)) {
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        r = rules[_i];
        if (!(typeof (_base = this.validators)[r] === "function" ? _base[r](elem) : void 0)) {
          this.errors[name] = (_ref2 = (_ref3 = (_ref4 = this.messagesOR[name]) != null ? _ref4[r] : void 0) != null ? _ref3 : this.messages[r]) != null ? _ref2 : 'Invalid data.';
          break;
        }
      }
    } else {
      for (r in rules) {
        opts = rules[r];
        valid = typeof opts === 'function' ? opts(elem) : typeof (_base1 = this.validators)[r] === "function" ? _base1[r](elem, opts) : void 0;
        if (!valid) {
          this.errors[name] = (_ref5 = (_ref6 = (_ref7 = this.messagesOR[name]) != null ? _ref7[r] : void 0) != null ? _ref6 : this.messages[r]) != null ? _ref5 : 'Invalid data.';
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

  Vanillidation.prototype.bindValidationEvents = function(name, elem, handler) {
    var conditionalValidation, dep, depElem, self, _i, _len, _ref, _results;
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
    elem.addEventListener('change', conditionalValidation);
    if (name in this.settings.dependencies) {
      _ref = this.settings.dependencies[name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dep = _ref[_i];
        depElem = this.fields[dep];
        _results.push(depElem.addEventListener('change', function() {
          return handler(elem);
        }));
      }
      return _results;
    }
  };

  return Vanillidation;

})();

module.exports = Vanillidation;


},{"./messages":2,"./utils":3,"./validators":4}]},{},[1])