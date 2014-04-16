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
  required: 'This field is required.',
  regex: 'The value doesn\'t match the format.',
  email: 'Enter a valid e-mail address.'
};


},{}],3:[function(require,module,exports){
module.exports = {
  isArray: function(o) {
    return (Object.prototype.toString.call(o)) === '[object Array]';
  }
};


},{}],4:[function(require,module,exports){
var fn;

module.exports = fn = {
  required: function(elem) {
    return (elem.value != null) && elem.value !== '';
  },
  regex: function(elem, expr) {
    return expr.test(elem.value);
  },
  email: function(elem) {
    return fn.regex(elem, new RegExp('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'));
  }
};


},{}],5:[function(require,module,exports){
var Vanillidation, utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('./utils');

Vanillidation = (function() {
  function Vanillidation(form, opts) {
    var elem, _i, _len, _ref;
    this.form = form;
    this.validateField = __bind(this.validateField, this);
    this.validators = require('./validators');
    this.messages = require('./messages');
    this.rules = opts != null ? opts.rules : void 0;
    this.fields = this.form.querySelectorAll('input[type="text"],input[type="password"],select,textarea');
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      this.bindValidationEvents(elem, this.validateField);
    }
  }

  Vanillidation.prototype.validateField = function(elem) {
    var name, opts, r, rules, _base, _base1, _i, _len, _ref, _results, _results1;
    name = elem.getAttribute('name');
    rules = (_ref = this.rules) != null ? _ref[name] : void 0;
    if (rules == null) {
      return;
    }
    if (utils.isArray(rules)) {
      _results = [];
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        r = rules[_i];
        _results.push(console.log(typeof (_base = this.validators)[r] === "function" ? _base[r](elem) : void 0));
      }
      return _results;
    } else {
      _results1 = [];
      for (r in rules) {
        opts = rules[r];
        _results1.push(console.log(typeof (_base1 = this.validators)[r] === "function" ? _base1[r](elem, opts) : void 0));
      }
      return _results1;
    }
  };

  Vanillidation.prototype.bindValidationEvents = function(elem, handler) {
    elem.addEventListener('blur', function() {
      return handler(this);
    });
    return elem.addEventListener('keyup', function() {
      return handler(this);
    });
  };

  return Vanillidation;

})();

module.exports = Vanillidation;


},{"./messages":2,"./utils":3,"./validators":4}]},{},[1])