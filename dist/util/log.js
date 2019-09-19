"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var options_1 = require("../options");
exports.default = {
    welcome: function () { return console.log(chalk_1.default.magentaBright('🎂 Pastry')); },
    success: function (template_rename) {
        return console.log(chalk_1.default.greenBright("\uD83C\uDF82 Pasted " + template_rename + "!"));
    },
    errorDirectoryOrFilesNotFound: function () {
        return console.error(chalk_1.default.red.bold('🎂 ERROR'), "Could not find directory OR files inside of directory " + options_1.userConfig.templateDirPath);
    }
};
