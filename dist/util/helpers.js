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
