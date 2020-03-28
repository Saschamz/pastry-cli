import inquirer from 'inquirer'
import { calculateAnswers, IAnswers } from './answers'
import {
  copyTemplateToFinalpath,
  copyTemplateToTemporaryPath,
  createOrRemoveTempDir,
  getTemplates,
  getVariantsToRemove,
  removePath,
  renameFiles
} from './main'
import { getOptions } from './options'
import questions from './questions'
import { getStringCasings } from './util/helpers'
import log from './util/log'

require('./util/prototypes')

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

export async function cli(rawArgs: string[]) {
  log.welcome()

  const options = getOptions(rawArgs)
  const prompts = []
  const templates = await getTemplates()

  if (!options.template_rename) prompts.push(questions.template_rename)
  if (!options.copy_path_affix) prompts.push(questions.copy_path_affix)

  if (!options.rename_existing) {
    if (!options.template_name) prompts.push(questions.template_name(templates))
  }

  const answersFromPrompt = await inquirer.prompt(prompts)
  const answers = calculateAnswers(options, answersFromPrompt)

  const flow = options.rename_existing ? renameFlow : createFlow

  flow(answers)
}

export async function createFlow(answers: IAnswers) {
  try {
    await createOrRemoveTempDir()
    await copyTemplateToTemporaryPath(answers)
    const variantsToRemove = await getVariantsToRemove(answers)
    await renameFiles(answers, variantsToRemove)
    await copyTemplateToFinalpath(answers)
    await createOrRemoveTempDir()

    log.success(answers.template_rename)
  } catch (error) {
    log.error('Error creating component', error.message)
  }
}

export async function renameFlow(answers: IAnswers) {
  const existingName = answers.copy_path_affix.split('/').reverse()[0]
  const searchStrings = getStringCasings(existingName)

  try {
    await createOrRemoveTempDir()
    await copyTemplateToTemporaryPath(answers)
    await renameFiles(answers, [], searchStrings)
    await copyTemplateToFinalpath(answers)
    await createOrRemoveTempDir()
    removePath(`${process.cwd()}/${answers.copy_path_affix}`)

    log.success_rename(existingName, answers.template_rename)
  } catch (error) {
    log.error('Error renaming component', error.message)
  }
}
