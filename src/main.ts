import findInFiles from 'find-in-files'
import fsx from 'fs-extra'
import glob from 'glob'
import inquirer from 'inquirer'
import replace from 'replace-in-file'
import { tempDirectoryPath } from './constants'
import { userConfig } from './options'
import questions from './questions'
import { CLIAnswers, StringCasings } from './types'
import {
  getOptionalSnippetRegExp,
  getStringCasings,
  sequencePromises,
} from './util/helpers'
import log from './util/log'
import { copy, exists, mkdir, readdir, rename, stats } from './util/promisified'

export async function getTemplates() {
  try {
    const templates = await readdir(userConfig.templateDirPath)
    if (!templates.length) throw Error
    return templates
  } catch (err) {
    log.errorDirectoryOrFilesNotFound()
    process.exit(1)
  }
}

export function copyTemplateToTemporaryPath({
  templatePath,
  temporaryCopyPath,
}: CLIAnswers) {
  return copy(templatePath, temporaryCopyPath, { clobber: false })
}

export function copyTemplateToFinalpath({
  temporaryCopyPath,
  finalCopyPath,
}: CLIAnswers) {
  return copy(temporaryCopyPath, finalCopyPath, { clobber: false })
}

export async function renameFiles(
  { template_rename, temporaryCopyPath },
  variantsToRemove,
  replacementStrings?: StringCasings
) {
  try {
    const stat = await stats(temporaryCopyPath)
    const isDirectory = stat.isDirectory()

    if (!isDirectory) {
      return await findAndReplace(
        temporaryCopyPath,
        template_rename,
        variantsToRemove,
        replacementStrings
      )
    }

    const filePaths = await getNestedFilePaths(temporaryCopyPath)

    return await Promise.all(
      filePaths.map((path: string) => {
        return findAndReplace(
          path,
          template_rename,
          variantsToRemove,
          replacementStrings
        )
      })
    )
  } catch (error) {
    log.error('Error renaming files', error.message)
  }
}

const getNestedFilePaths = async function (dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(dir + '/**/*', (error, response) => {
      if (error) return reject(error)
      resolve(
        response.filter((path) => /.+\..+/.test(path.split('/').reverse()[0]))
      )
    })
  })
}

export async function removeOptional(fileName: string, name: string) {
  await replace({
    files: fileName,
    from: getOptionalSnippetRegExp(name),
    to: '',
  }).catch((error) => log.error(error.message))
}

export async function removeAllOptionalComments(fileName: string) {
  const regExp = new RegExp(`\/\/.+pastry.+`, 'ig')

  await replace({
    files: fileName,
    from: regExp,
    to: '',
  }).catch((error) => log.error(error.message))
}

export async function findAndReplace(
  path: string,
  replacement: string,
  variantsToRemove: string[],
  searchStrings: StringCasings = {
    default: 'PLACEHOLDER',
    lower: 'LOWER_PLACEHOLDER',
    upper: 'UPPER_PLACEHOLDER',
    pascal: 'PASCAL_PLACEHOLDER',
  }
) {
  const fileNameRegExp = new RegExp(searchStrings.default + '(?=\\.)', 'i')
  const defaultRegExp = new RegExp(searchStrings.default, 'g')
  const upperRegExp = new RegExp(searchStrings.upper, 'g')
  const lowerRegExp = new RegExp(searchStrings.lower, 'g')
  const pascalRegExp = new RegExp(searchStrings.pascal, 'g')

  const fileName = path.replace(fileNameRegExp, replacement)

  try {
    if (path !== fileName) {
      await rename(path, fileName)
    }

    await sequencePromises(
      variantsToRemove.map((variant) => () => removeOptional(fileName, variant))
    )

    await removeAllOptionalComments(fileName)

    const replacements = getStringCasings(replacement)

    await replace({
      files: fileName,
      from: upperRegExp,
      to: replacements.upper,
    })

    await replace({
      files: fileName,
      from: lowerRegExp,
      to: replacements.lower,
    })

    await replace({
      files: fileName,
      from: pascalRegExp,
      to: replacements.pascal,
    })

    await replace({
      files: fileName,
      from: defaultRegExp,
      to: replacements.default,
    })
  } catch (error) {
    log.error('Error replacing file names/values', error.message)
  }
}

export async function removeFromFiles(files, regEx) {
  return await replace({
    files,
    from: regEx,
    to: '',
  })
}

export async function getTemplateOptionals({
  tempDirectoryPath,
}: CLIAnswers): Promise<string[]> {
  const files = await findInFiles.find('pastry-start', tempDirectoryPath, '.')

  const lines = Object.values(files)
    .map((file: any) => file.line)
    //@ts-ignore
    .flat()

  const templateOptionals = lines
    .map((line: string) => line.split('pastry-start'))
    .filter((words: string[]) => words.length >= 2)
    .map((words: string[]) => words[1].trim())
    .filter(Boolean)

  return Array.from(new Set(templateOptionals))
}

export async function createOrRemoveTempDir() {
  const tempDirExists = await exists(tempDirectoryPath)
  if (!tempDirExists) return await mkdir(tempDirectoryPath)
  removePath(tempDirectoryPath)
}

export function removePath(path: string) {
  fsx.removeSync(path)
}

export async function getVariantsToRemove(answers: CLIAnswers) {
  const availableTemplateVariants = await getTemplateOptionals(answers)
  let variantsToRemove = []

  if (availableTemplateVariants.length) {
    const { selected_variants } = await inquirer.prompt(
      questions.selected_variants(availableTemplateVariants)
    )
    variantsToRemove = availableTemplateVariants.filter(
      (variant) => !selected_variants.includes(variant)
    )
  }

  return variantsToRemove
}
