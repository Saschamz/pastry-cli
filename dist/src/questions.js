export default {
    template_name: (choices) => ({
        type: 'list',
        name: 'template_name',
        message: 'Select a template',
        choices,
    }),
    template_rename: {
        type: 'input',
        name: 'template_rename',
        message: 'What would you like to name this?',
    },
    copy_path_affix: {
        type: 'fuzzypath',
        itemType: 'directory',
        excludePath: (nodePath) => /(^\..+|node_modules|dist|out|build)/.test(nodePath),
        name: 'copy_path_affix',
        message: 'Select target directory',
    },
    selected_variants: (choices) => ({
        name: 'selected_variants',
        type: 'checkbox',
        choices,
        message: 'Please select your variants',
    }),
};
