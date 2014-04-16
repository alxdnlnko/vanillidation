(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        window.Vanillidation = factory();
    }
})(function() {
    return require('./vanillidation');
});
