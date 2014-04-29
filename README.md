Vanillidation
==================

Vanilla javascript form validation without any dependencies.

The main use case of this library is to provide client-side validation for modern browsers, while you already have one in the backend. The main advantage of using it is that you don't need to include any dependencies like `jquery`, leaving your frontend lightweight and fresh like a vanilla petal.

Usage
-----

```
<script src="vanillidation.js"></script>
<script>
    var v = new Vanillidation(document.getElementById('test_form'), {
        rules: {
            first_name: ['required', 'isASCII'],
            last_name: ['required', 'isASCII'],  // validators without parameters
            password: {  // validators with parameters or custom validators
                minLength: 6,  // parameter
                goodPass: function(elem) {  // custom validator
                    var sum = 0;
                    if (/([a-z])/.exec(elem.value)) sum += 1;
                    if (/([A-Z])/.exec(elem.value)) sum += 1;
                    if (/([0-9!@#\$%\^\&*\)\(+=.,\/\\_\-\{\}\?;:~`\'"\[\]<>])/.exec(elem.value)) sum += 1;
                    return sum > 1;
                }
            },
            credit_card: {
                required: true,
                creditCard: document.getElementById('id_credit_card_type')
            },
        },
        messages: {  // override default messages
            password: {
                minLength: 'Password must be at least 6 characters long.',
                goodPass: 'Your password is too weak.'  // message for custom validator
            },
            __form__: 'You have some errors in the form below.'  // global form validation message
        },
        errorClass: 'form-row--not-valid',  // ivalid element class
        classToParent: true,  // apply errorClass to parent element
        errorListClass: 'errorlist',
        conditional: {  // conditional validation
            last_name: function() {  // condition function
                return document.getElementById('id_first_name').value.length > 0;
            },
            credit_card: 'password'  // can be the name of element (validate credit card only if password is valid)
        },
        dependencies: {  // revalidate dependants when element changes
            credit_card: ['credit_card_type']  // revalidate credit card when type changes 
        }
    });
</script>
```
You can find another validators in `src/validators.coffee`.

Browsers compatibility
----------------------

- `document.getElementsByClassName`: Chrome, Firefox 3+, IE 9+, Opera, Safari
- `document.querySelectorAll`: Chrome 1+, Firefox 3.5+, IE 8+, Opera 10+, Safari 3.2+
- **summary**: Chrome 1+, Firefox 3.5+, IE 9+, Opera 10+, Safari 3.2+

Plans
-----

- porting of `jquery.validation` validators
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
