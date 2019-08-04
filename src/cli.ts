import inquirer from 'inquirer'
import chalk from 'chalk'

require('./util/prototypes')
import { getOptions } from './options'
import questions from './questions'

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

import {
  getTemplates,
  renameFiles,
  copyTemplateToTemporaryPath,
  copyTemplateToFinalpath,
  createOrRemoveTempDir,
  getVariantsToRemove
} from './main'
import { calculateAnswers } from './answers'

export async function cli(rawArgs) {
  console.log(chalk.magentaBright('🎂 Pastry'))

  const options = getOptions(rawArgs)
  const prompts = []
  const templates = await getTemplates()

  if (!options.template_name) prompts.push(questions.template_name(templates))
  if (!options.template_rename) prompts.push(questions.template_rename)
  if (!options.copy_path_affix) prompts.push(questions.copy_path_affix)

  const answersFromPrompt = await inquirer.prompt(prompts)
  const answers = calculateAnswers(options, answersFromPrompt)

  await createOrRemoveTempDir()
  await copyTemplateToTemporaryPath(answers)
  const variantsToRemove = await getVariantsToRemove(answers)
  await renameFiles(answers, variantsToRemove)
  await copyTemplateToFinalpath(answers)
  await createOrRemoveTempDir()

  console.log(chalk.greenBright(`🎂 Pasted ${answers.template_rename}!`))
}
