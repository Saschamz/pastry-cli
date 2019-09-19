"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = require("./options");
var constants_1 = require("./constants");
function calculateAnswers(options, answersFromPrompt) {
    var opts = __assign({}, options, answersFromPrompt);
    var fileExtension = opts.template_name.split('.');
    fileExtension =
        fileExtension.length === 1
            ? ''
            : "." + fileExtension[fileExtension.length - 1];
    var answers = __assign({}, opts, { templatePath: options_1.userConfig.templateDirPath + "/" + opts.template_name, finalCopyPath: process.cwd() + "/" + opts.copy_path_affix + "/" + opts.template_rename + fileExtension, temporaryCopyPath: constants_1.tempDirectoryPath + "/" + opts.template_name, tempDirectoryPath: constants_1.tempDirectoryPath });
    return answers;
}
exports.calculateAnswers = calculateAnswers;
