"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var arg_1 = __importDefault(require("arg"));
exports.userConfig = getUserConfig();
function getUserConfig() {
    try {
        var config = require(process.cwd() + "/.pastryconfig.json");
        return {
            templateDirPath: process.cwd() + '/' + (config.templateDir || 'pastries')
        };
    }
    catch (err) {
        return {
            templateDirPath: process.cwd() + '/pastries'
        };
    }
}
function getOptions(rawArgs) {
    var args = arg_1.default({
        '--template': String,
        '--path': String,
        '--name': String,
        '--help': arg_1.default.COUNT,
        '-n': '--name',
        '-p': '--path',
        '-t': '--template',
        '-h': '--help'
    }, {
        argv: rawArgs.slice(2)
    });
    if (args['--help'] > 0) {
        console.log("\n      --template | -b) Specify template name\n      --path | -p) Specify new relative path\n      --name |\u00A0-n) Specify new name\n      --help | -h) See all available arguments\n    ");
        process.exit(0);
    }
    return {
        template_name: args['--template'],
        copy_path_affix: args['--path'],
        template_rename: args['--name']
    };
}
exports.getOptions = getOptions;
