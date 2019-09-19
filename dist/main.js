"use strict";
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
var replace_in_file_1 = __importDefault(require("replace-in-file"));
var find_in_files_1 = __importDefault(require("find-in-files"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var inquirer_1 = __importDefault(require("inquirer"));
var promisified_1 = require("./util/promisified");
var helpers_1 = require("./util/helpers");
var options_1 = require("./options");
var constants_1 = require("./constants");
var questions_1 = __importDefault(require("./questions"));
var log_1 = __importDefault(require("./util/log"));
function getTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var templates, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promisified_1.readdir(options_1.userConfig.templateDirPath)];
                case 1:
                    templates = _a.sent();
                    if (!templates.length)
                        throw Error;
                    return [2 /*return*/, templates];
                case 2:
                    err_1 = _a.sent();
                    log_1.default.errorDirectoryOrFilesNotFound();
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getTemplates = getTemplates;
function copyTemplateToTemporaryPath(_a) {
    var templatePath = _a.templatePath, temporaryCopyPath = _a.temporaryCopyPath;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promisified_1.copy(templatePath, temporaryCopyPath, { clobber: false })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.copyTemplateToTemporaryPath = copyTemplateToTemporaryPath;
function copyTemplateToFinalpath(_a) {
    var temporaryCopyPath = _a.temporaryCopyPath, finalCopyPath = _a.finalCopyPath;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promisified_1.copy(temporaryCopyPath, finalCopyPath, { clobber: false })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.copyTemplateToFinalpath = copyTemplateToFinalpath;
function renameFiles(_a, variantsToRemove) {
    var template_rename = _a.template_rename, temporaryCopyPath = _a.temporaryCopyPath;
    return __awaiter(this, void 0, void 0, function () {
        var stat, isDirectory, filePaths;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promisified_1.stats(temporaryCopyPath)];
                case 1:
                    stat = _b.sent();
                    isDirectory = stat.isDirectory();
                    if (!!isDirectory) return [3 /*break*/, 3];
                    return [4 /*yield*/, findAndReplace(temporaryCopyPath, template_rename, variantsToRemove)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, getNestedFilePaths(temporaryCopyPath)];
                case 4:
                    filePaths = _b.sent();
                    return [4 /*yield*/, Promise.all(filePaths.map(function (path) {
                            return findAndReplace(path, template_rename, variantsToRemove);
                        }))];
                case 5: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.renameFiles = renameFiles;
var getNestedFilePaths = function (dir, filelist) {
    return __awaiter(this, void 0, void 0, function () {
        var path, fs, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = path || require('path');
                    fs = fs || require('fs');
                    return [4 /*yield*/, promisified_1.readdir(dir)];
                case 1:
                    files = _a.sent();
                    filelist = filelist || [];
                    files.forEach(function (file) {
                        if (fs.statSync(path.join(dir, file)).isDirectory()) {
                            filelist = getNestedFilePaths(path.join(dir, file), filelist);
                        }
                        else {
                            filelist.push(path.join(dir, file));
                        }
                    });
                    return [2 /*return*/, filelist];
            }
        });
    });
};
function removeOptional(fileName, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, replace_in_file_1.default({
                        files: fileName,
                        from: helpers_1.getOptionalSnippetRegExp(name),
                        to: ''
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeOptional = removeOptional;
function removeAllOptionalComments(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var regExp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regExp = new RegExp("//.+pastry.+", 'ig');
                    return [4 /*yield*/, replace_in_file_1.default({
                            files: fileName,
                            from: regExp,
                            to: ''
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAllOptionalComments = removeAllOptionalComments;
function findAndReplace(path, replacement, variantsToRemove) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = path.replace(/PLACEHOLDER/i, replacement);
                    if (!(path !== fileName)) return [3 /*break*/, 2];
                    return [4 /*yield*/, promisified_1.rename(path, fileName)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, helpers_1.sequencePromises(variantsToRemove.map(function (variant) { return function () { return removeOptional(fileName, variant); }; }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, removeAllOptionalComments(fileName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, replace_in_file_1.default({
                            files: fileName,
                            from: /PLACEHOLDER/g,
                            to: replacement
                        })];
                case 5: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.findAndReplace = findAndReplace;
function removeFromFiles(files, regEx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, replace_in_file_1.default({
                        files: files,
                        from: regEx,
                        to: ''
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.removeFromFiles = removeFromFiles;
function getTemplateOptionals(_a) {
    var tempDirectoryPath = _a.tempDirectoryPath;
    return __awaiter(this, void 0, void 0, function () {
        var files, lines, templateOptionals;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, find_in_files_1.default.find('pastry-start', tempDirectoryPath, '.')];
                case 1:
                    files = _b.sent();
                    lines = Object.values(files)
                        .map(function (file) { return file.line; })
                        //@ts-ignore
                        .flat();
                    templateOptionals = lines
                        .map(function (line) { return line.split('pastry-start'); })
                        .filter(function (words) { return words.length >= 2; })
                        .map(function (words) { return words[1].trim(); })
                        .filter(Boolean);
                    return [2 /*return*/, Array.from(new Set(templateOptionals))];
            }
        });
    });
}
exports.getTemplateOptionals = getTemplateOptionals;
function createOrRemoveTempDir() {
    return __awaiter(this, void 0, void 0, function () {
        var tempDirExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promisified_1.exists(constants_1.tempDirectoryPath)];
                case 1:
                    tempDirExists = _a.sent();
                    if (!!tempDirExists) return [3 /*break*/, 3];
                    return [4 /*yield*/, promisified_1.mkdir(constants_1.tempDirectoryPath)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    fs_extra_1.default.removeSync(constants_1.tempDirectoryPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.createOrRemoveTempDir = createOrRemoveTempDir;
function getVariantsToRemove(answers) {
    return __awaiter(this, void 0, void 0, function () {
        var availableTemplateVariants, variantsToRemove, selected_variants_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTemplateOptionals(answers)];
                case 1:
                    availableTemplateVariants = _a.sent();
                    variantsToRemove = [];
                    if (!availableTemplateVariants.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, inquirer_1.default.prompt(questions_1.default.selected_variants(availableTemplateVariants))];
                case 2:
                    selected_variants_1 = (_a.sent()).selected_variants;
                    variantsToRemove = availableTemplateVariants.filter(function (variant) { return !selected_variants_1.includes(variant); });
                    _a.label = 3;
                case 3: return [2 /*return*/, variantsToRemove];
            }
        });
    });
}
exports.getVariantsToRemove = getVariantsToRemove;
