export default {
  template_type: (choices: string[]) => ({
    type: 'list',
    name: 'template_type',
    message: 'Select a template type',
    choices,
  }),
  template_name: (choices: string[]) => ({
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
    excludePath: (nodePath: string) =>
      nodePath.startsWith('node_modules') || nodePath.startsWith('.git'),
    name: 'copy_path_affix',
    message: 'Select target directory',
  },
  selected_variants: (choices: string[]) => ({
    name: 'selected_variants',
    type: 'checkbox',
    choices,
    message: 'Please select your variants',
  }),
}
