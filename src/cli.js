import inquirer from 'inquirer'
import chalk from 'chalk'

require('./prototypes.js')
import { getOptions } from './options'
import questions from './questions'

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

import {
  getTemplates,
  copyTemplate,
  renameFiles,
  getTemplateOptionals
} from './main'

export async function cli(rawArgs) {
  console.log(chalk.magentaBright('🎂 Pastry'))

  const options = getOptions(rawArgs)
  const prompts = []
  const templates = await getTemplates()

  if (!options.template_name) prompts.push(questions.template_name(templates))
  if (!options.template_rename) prompts.push(questions.template_rename)
  if (!options.copy_path_affix) prompts.push(questions.copy_path_affix)

  const answersFromPrompt = await inquirer.prompt(prompts)
  const answers = { ...options, ...answersFromPrompt }

  const path = await copyTemplate(answers)
  await renameFiles({ ...answers, path })

  const availableTemplateVariants = await getTemplateOptionals(path)
  const { selected_variants } = await inquirer.prompt(
    questions.selected_variants(availableTemplateVariants)
  )
  const variantsToRemove = availableTemplateVariants.filter(
    variant => !selected_variants.includes(variant)
  )

  console.log('selected_variants', selected_variants)
  console.log('variantsToRemove', variantsToRemove)

  console.log(chalk.greenBright(`🎂 Pasted ${answers.template_rename}!`))
}
