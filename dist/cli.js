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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
require('./prototypes');
var options_1 = require("./options");
var questions_1 = __importDefault(require("./questions"));
inquirer_1.default.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
var main_1 = require("./main");
function cli(rawArgs) {
    return __awaiter(this, void 0, void 0, function () {
        var options, prompts, templates, answersFromPrompt, answers, path, availableTemplateVariants, selected_variants, variantsToRemove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(chalk_1.default.magentaBright('🎂 Pastry'));
                    options = options_1.getOptions(rawArgs);
                    prompts = [];
                    return [4 /*yield*/, main_1.getTemplates()];
                case 1:
                    templates = _a.sent();
                    if (!options.template_name)
                        prompts.push(questions_1.default.template_name(templates));
                    if (!options.template_rename)
                        prompts.push(questions_1.default.template_rename);
                    if (!options.copy_path_affix)
                        prompts.push(questions_1.default.copy_path_affix);
                    return [4 /*yield*/, inquirer_1.default.prompt(prompts)];
                case 2:
                    answersFromPrompt = _a.sent();
                    answers = __assign({}, options, answersFromPrompt);
                    return [4 /*yield*/, main_1.copyTemplate(answers)];
                case 3:
                    path = _a.sent();
                    return [4 /*yield*/, main_1.renameFiles(__assign({}, answers, { path: path }))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, main_1.getTemplateOptionals(path)];
                case 5:
                    availableTemplateVariants = _a.sent();
                    return [4 /*yield*/, inquirer_1.default.prompt(questions_1.default.selected_variants(availableTemplateVariants))];
                case 6:
                    selected_variants = (_a.sent()).selected_variants;
                    variantsToRemove = availableTemplateVariants.filter(function (variant) { return !selected_variants.includes(variant); });
                    console.log('selected_variants', selected_variants);
                    console.log('variantsToRemove', variantsToRemove);
                    console.log(chalk_1.default.greenBright("\uD83C\uDF82 Pasted " + answers.template_rename + "!"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.cli = cli;
