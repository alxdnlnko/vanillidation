Vanillidation
==================

Vanilla javascript form validation without any dependencies.

The main use case of this library is to provide client-side validation for modern browsers, while you already have one in the backend. The main advantage of using it is that you don't need to include any dependencies like `jquery`, leaving your frontend lightweight and fresh like a vanilla petal.

Usage
-----

Add Vanillidation to the page:
```
<script src="vanillidation.min.js"></script>
```

Setup validation:
```
new Vanillidation(document.getElementById('test_form'), opts);
```

###Options

####opts.rules
`opts.rules` is an object for defining validators for every form field. Keys of rules object are the names of fields, a value can be a list or an object.

```
new Vanillidation(form, {
    rules: {
        first_name: ['required', 'isASCII'],  // a simple list of validators names
        last_name: {  // an object for defining validators with parameters
            required: true,
            isASCII: true,
            minLength: 6
        },
        password: {
            required: true,
            goodPass: function(elem) {  // custom validator
                var sum = 0;
                if (/([a-z])/.exec(elem.value)) sum += 1;
                if (/([A-Z])/.exec(elem.value)) sum += 1;
                if (/([0-9!@#\$%\^\&*\)\(+=.,\/\\_\-\{\}\?;:~`\'"\[\]<>])/.exec(elem.value)) sum += 1;
                return sum > 1;
            }
        }
    },
    ...
});
```

####opts.messages
`opts.messages` is an object for defining custom error messages for any field and validator.
Every validator has a default message in `src/messages.coffee`.
```
new Vanillidation(form, {
    rules: {...},
    messages: {
        first_name: {
            required: 'Enter your first name, please.'
        },
        last_name: {
            minLength: 'Your last name must be at least 6 letters long.'
        },
        password: {
            goodPass: 'Your password is too weak.'  // an error message for custom validator
        }
    }
});
```

####opts.errorClass
`opts.errorClass` specifies the class, which would be added to the invalid input.
Default value: `has-error`.
```
new Vanillidation(form, {
    ...
    errorClass: 'invalid-input'
});
```

####opts.classToParent
`opts.classToParent` is used to apply `opts.errorClass` to the parent element.
Default value: `false`.
```
new Vanillidation(form, {
    ...
    errorClass: 'form-row--not-valid',
    applyToParent: true
});
```

####opts.errorListClass
`opts.errorListClass` specifies the class for error list.
Default value: `errorlist`.
```
new Vanillidation(form, {
    ...
    errorListClass: 'errors'
});
```

####opts.showFormErors
`opts.showFormErrors` specifies if the global form error message must be shown on submit.
Default value: `true`.
```
new Vanillidation(form, {
    showFormErrors: true,
    messages: {
        __form__: 'You have some errors in the form below.'  // custom form error message
    }
});
```

####opts.conditional
`opts.conditional` is an object where you can define conditions must be satisfied before validating a specified field.
```
new Vanillidation(form, {
    conditional: {
        password: function() {  // function-condition
            return document.getElementById('id_first_name').value.length > 0;  // validate a password field only if first_name field is not empty
        },
        last_name: 'first_name'  // validate last_name only if first_name field is valid
    }
});
```

####opts.depndencies
`opts.dependencies` is an object where you can define dependencies between the fields. Dependent fields would be revalidated every time the specified field changes.
```
new Vanillidation(form, {
    dependencies: {
        credit_card_number: ['credit_card_type']  // credit card number would be revalidated on every credit card type change
    }
});
```

### Validators
You can find validators in `src/validators.coffee`. Feel free to add your validators there only if you are sure that it would be useful for sombody else, let's care about the library size.


Browsers compatibility
----------------------

- `document.getElementsByClassName`: Chrome, Firefox 3+, IE 9+, Opera, Safari
- `document.querySelectorAll`: Chrome 1+, Firefox 3.5+, IE 8+, Opera 10+, Safari 3.2+
- **summary**: Chrome 1+, Firefox 3.5+, IE 9+, Opera 10+, Safari 3.2+

Plans
-----

- porting of some `jquery.validation` validators
- enhancements
- *better browsers compatibility - minor*

Contribution
------------

1. fork
2. clone
3. git submodule init && git submodule update
4. vagrant up
5. vagrant ssh
6. cd /vagrant
7. npm install
8. cult
9. Open in browser http://127.0.0.1:3000
