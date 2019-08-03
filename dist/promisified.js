"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var ncp_1 = __importDefault(require("ncp"));
var util_1 = require("util");
exports.readdir = util_1.promisify(fs_1.default.readdir);
exports.copy = util_1.promisify(ncp_1.default);
exports.rename = util_1.promisify(fs_1.default.rename);
exports.stats = util_1.promisify(fs_1.default.stat);
exports.access = util_1.promisify(fs_1.default.access);
exports.readfile = util_1.promisify(fs_1.default.readFile);
exports.exists = util_1.promisify(fs_1.default.exists);
exports.mkdir = util_1.promisify(fs_1.default.mkdir);
exports.rmdir = util_1.promisify(fs_1.default.rmdir);
