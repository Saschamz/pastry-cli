"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    template_name: function (choices) { return ({
        type: 'list',
        name: 'template_name',
        message: 'Select a template',
        choices: choices
    }); },
    template_rename: {
        type: 'input',
        name: 'template_rename',
        message: 'What would you like to name this?'
    },
    copy_path_affix: {
        type: 'fuzzypath',
        itemType: 'directory',
        excludePath: function (nodePath) {
            return nodePath.startsWith('node_modules') || nodePath.startsWith('.git');
        },
        name: 'copy_path_affix',
        message: 'Select target directory'
    },
    selected_variants: function (choices) { return ({
        name: 'selected_variants',
        type: 'checkbox',
        choices: choices,
        message: 'Please select your variants'
    }); }
};
