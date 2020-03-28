import findInFiles from 'find-in-files'
import fsx from 'fs-extra'
import inquirer from 'inquirer'
import replace from 'replace-in-file'
import { IAnswers } from './answers'
import { tempDirectoryPath } from './constants'
import { userConfig } from './options'
import questions from './questions'
import { StringCasings } from './types'
import {
  getOptionalSnippetRegExp,
  getStringCasings,
  sequencePromises
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

export async function copyTemplateToTemporaryPath({
  templatePath,
  temporaryCopyPath
}: IAnswers) {
  await copy(templatePath, temporaryCopyPath, { clobber: false })
}

export async function copyTemplateToFinalpath({
  temporaryCopyPath,
  finalCopyPath
}: IAnswers) {
  await copy(temporaryCopyPath, finalCopyPath, { clobber: false })
}

export async function renameFiles(
  { template_rename, temporaryCopyPath },
  variantsToRemove,
  replacementStrings?: StringCasings
) {
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
    filePaths.map((path: string) =>
      findAndReplace(
        path,
        template_rename,
        variantsToRemove,
        replacementStrings
      )
    )
  )
}

const getNestedFilePaths = async function(dir, filelist?: any) {
  var path = path || require('path')
  var fs = fs || require('fs'),
    files = await readdir(dir)
  filelist = filelist || []
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = getNestedFilePaths(path.join(dir, file), filelist)
    } else {
      filelist.push(path.join(dir, file))
    }
  })

  return filelist
}

export async function removeOptional(fileName, name: string) {
  await replace({
    files: fileName,
    from: getOptionalSnippetRegExp(name),
    to: ''
  })
}

export async function removeAllOptionalComments(fileName) {
  const regExp = new RegExp(`\/\/.+pastry.+`, 'ig')

  await replace({
    files: fileName,
    from: regExp,
    to: ''
  })
}

export async function findAndReplace(
  path: string,
  replacement: string,
  variantsToRemove: string[],

  searchStrings: StringCasings = {
    default: 'PLACEHOLDER',
    lower: 'LOWER_PLACEHOLDER',
    upper: 'UPPER_PLACEHOLDER',
    pascal: 'PASCAL_PLACEHOLDER'
  }
) {
  const fileNameRegExp = new RegExp(searchStrings.default + '(?=\\.)', 'i')
  const defaultRegExp = new RegExp(searchStrings.default, 'g')
  const upperRegExp = new RegExp(searchStrings.upper, 'g')
  const lowerRegExp = new RegExp(searchStrings.lower, 'g')
  const pascalRegExp = new RegExp(searchStrings.pascal, 'g')

  const fileName = path.replace(fileNameRegExp, replacement)
  if (path !== fileName) {
    await rename(path, fileName)
  }

  await sequencePromises(
    variantsToRemove.map(variant => () => removeOptional(fileName, variant))
  )

  await removeAllOptionalComments(fileName)

  const replacements = getStringCasings(replacement)

  try {
    await replace({
      files: fileName,
      from: upperRegExp,
      to: replacements.upper
    })

    await replace({
      files: fileName,
      from: lowerRegExp,
      to: replacements.lower
    })

    await replace({
      files: fileName,
      from: pascalRegExp,
      to: replacements.pascal
    })

    await replace({
      files: fileName,
      from: defaultRegExp,
      to: replacements.default
    })
  } catch (error) {
    console.log(`Error replacing placeholder values: ${error.message}`)
  }
}

export async function removeFromFiles(files, regEx) {
  return await replace({
    files,
    from: regEx,
    to: ''
  })
}

export async function getTemplateOptionals({
  tempDirectoryPath
}: IAnswers): Promise<string[]> {
  const files = await findInFiles.find('pastry-start', tempDirectoryPath, '.')

  const lines = Object.values(files)
    .map((file: any) => file.line)
    //@ts-ignore
    .flat()

  const templateOptionals = lines
    .map(line => line.split('pastry-start'))
    .filter(words => words.length >= 2)
    .map(words => words[1].trim())
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

export async function getVariantsToRemove(answers: IAnswers) {
  const availableTemplateVariants = await getTemplateOptionals(answers)
  let variantsToRemove = []

  if (availableTemplateVariants.length) {
    const { selected_variants } = await inquirer.prompt(
      questions.selected_variants(availableTemplateVariants)
    )
    variantsToRemove = availableTemplateVariants.filter(
      variant => !selected_variants.includes(variant)
    )
  }

  return variantsToRemove
}
