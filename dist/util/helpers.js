"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequencePromises = function (funcs) {
    return funcs.reduce(function (promise, func) {
        return promise.then(function (result) { return func().then(Array.prototype.concat.bind(result)); });
    }, Promise.resolve([]));
};
function getOptionalSnippetRegExp(name) {
    return new RegExp("//.+pastry-start.+" + name + "(.|\n)+//.+pastry-end.+" + name, 'igm');
}
exports.getOptionalSnippetRegExp = getOptionalSnippetRegExp;
function getStringCasings(str) {
    var upper = str.toUpperCase();
    var lower = str.toLowerCase();
    var pascal = "" + str[0].toUpperCase() + str.substr(1);
    return {
        default: str,
        upper: upper,
        lower: lower,
        pascal: pascal
    };
}
exports.getStringCasings = getStringCasings;
