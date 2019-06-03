import inquirer from 'inquirer'
import chalk from 'chalk'
import arg from 'arg'

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

import { getTemplates, copyTemplate, renameFiles } from './main'

export async function cli(rawArgs) {
  const options = getOptions(rawArgs)
  const questions = []
  const templates = await getTemplates()

  if (!options.template_name) {
    questions.push({
      type: 'list',
      name: 'template_name',
      message: 'Select a template',
      choices: templates
    })
  }

  if (!options.template_rename) {
    questions.push({
      type: 'input',
      name: 'template_rename',
      message: 'What would you like to name this?'
    })
  }

  if (!options.copy_path_affix) {
    questions.push({
      type: 'fuzzypath',
      itemType: 'directory',
      excludePath: nodePath => nodePath.startsWith('node_modules'),
      name: 'copy_path_affix',
      message: 'Select target directory'
    })
  }

  const answersFromPrompt = await inquirer.prompt(questions)
  const answers = { ...options, ...answersFromPrompt }

  const path = await copyTemplate(answers)
  await renameFiles({ ...answers, path })

  console.log(chalk.greenBright('Success!'))
}

function getOptions(rawArgs) {
  const args = arg(
    {
      '--blueprint': String,
      '--path': String,
      '--name': String,
      '--help': arg.COUNT,
      '-n': '--name',
      '-p': '--path',
      '-b': '--blueprint',
      '-h': '--help'
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  if (args['--help'] > 0) {
    console.log(`
      --blueprint | -b) Specify blueprint name
      --path | -p) Specify new relative path
      --name | -n) Specify new name
      --help | -h) See all available arguments
    `)
    process.exit(0)
  }

  return {
    template_name: args['--template'],
    copy_path_affix: args['--path'],
    template_rename: args['--name']
  }
}
