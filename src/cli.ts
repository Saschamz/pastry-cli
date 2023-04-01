import inquirer from 'inquirer'
import { calculateAnswers } from './answers'
import {
  copyTemplateToFinalpath,
  copyTemplateToTemporaryPath,
  createOrRemoveTempDir,
  downloadGithubFilesToTemporaryPath,
  getGistTemplates,
  getLocalTemplates,
  getVariantsToRemove,
  removePath,
  renameFiles,
} from './main'
import { getOptions } from './options'
import questions from './questions'
import { CLIAnswers, GithubFile } from './types'
import { getStringCasings } from './util/helpers'
import log from './util/log'

require('./util/prototypes')

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

export async function cli(rawArgs: string[]) {
  try {
    log.welcome()
    const options = getOptions(rawArgs)
    const prompts = []
    const localTemplates = await getLocalTemplates()
    const gistTemplates = await getGistTemplates()
    const gistTemplateNames = gistTemplates.map(template => template.description)
    console.log('gistTemplateNames', gistTemplateNames)
    const templates = [...localTemplates, ...gistTemplateNames]

    if (!templates.length) {
      console.log('WIP NO TEMPLATES')
      process.exit(0)
    }

    if (!options.rename_existing && !options.template_name) {
      prompts.push(questions.template_name(templates))
    }
    if (!options.template_rename) prompts.push(questions.template_rename)
    if (!options.copy_path_affix) prompts.push(questions.copy_path_affix)

    const answersFromPrompt = await inquirer.prompt(prompts)
    const answers = calculateAnswers(options, answersFromPrompt)

    if (options.rename_existing) {
      return renameFlow(answers)
    }

    const gistFiles = gistTemplates.find(t => t.description === answers.template_name) as any

    createFlow(answers, gistFiles && gistFiles.files)
  } catch (err) {
    process.exit(0)
  }
}

export async function createFlow(answers: CLIAnswers, githubFiles?: Record<string, GithubFile>) {
  try {
    await createOrRemoveTempDir()
    if (githubFiles) {
      await downloadGithubFilesToTemporaryPath(answers, githubFiles)
    } else {
      await copyTemplateToTemporaryPath(answers)
    }
    console.log('1')
    const variantsToRemove = await getVariantsToRemove(answers)
    console.log('2')
    await renameFiles(answers, variantsToRemove)
    console.log('3')
    await copyTemplateToFinalpath(answers)
    console.log('4')
    await createOrRemoveTempDir()
    log.success(answers.template_rename)
  } catch (error) {
    log.error('Error creating component', error.message)
  }
}

export async function renameFlow(answers: CLIAnswers) {
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
