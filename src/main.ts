import replace from 'replace-in-file'
import findInFiles from 'find-in-files'
import fsx from 'fs-extra'
import inquirer from 'inquirer'

import { copy, readdir, rename, stats, mkdir, exists } from './util/promisified'
import { sequencePromises, getOptionalSnippetRegExp } from './util/helpers'
import { userConfig } from './options'
import { tempDirectoryPath } from './constants'
import questions from './questions'
import { IAnswers } from './answers'
import log from './util/log'

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
  variantsToRemove
) {
  const stat = await stats(temporaryCopyPath)
  const isDirectory = stat.isDirectory()

  if (!isDirectory) {
    return await findAndReplace(
      temporaryCopyPath,
      template_rename,
      variantsToRemove
    )
  }

  const filePaths = await getNestedFilePaths(temporaryCopyPath)

  return await Promise.all(
    filePaths.map((path: string) =>
      findAndReplace(path, template_rename, variantsToRemove)
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

export async function findAndReplace(path, replacement, variantsToRemove) {
  const fileName = path.replace(/PLACEHOLDER/i, replacement)
  if (path !== fileName) {
    await rename(path, fileName)
  }

  await sequencePromises(
    variantsToRemove.map(variant => () => removeOptional(fileName, variant))
  )

  await removeAllOptionalComments(fileName)

  return await replace({
    files: fileName,
    from: /PLACEHOLDER/g,
    to: replacement
  })
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
  fsx.removeSync(tempDirectoryPath)
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
