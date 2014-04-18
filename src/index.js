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
