import inquirer from 'inquirer'

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
import log from './util/log'

export async function cli(rawArgs) {
  log.welcome()

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

  log.success(answers.template_rename)
}
