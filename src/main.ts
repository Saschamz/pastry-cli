import chalk from 'chalk'
import replace from 'replace-in-file'
import findInFiles from 'find-in-files'
import fsx from 'fs-extra'

import { copy, readdir, rename, stats, mkdir, exists } from './promisified'
import { userConfig } from './options'
import { tempDirectoryPath } from './constants'

export async function getTemplates() {
  try {
    const templates = await readdir(userConfig.templateDirPath)
    if (!templates.length) throw Error
    return templates
  } catch (err) {
    console.error(
      chalk.red.bold('🎂 ERROR'),
      `Could not find directory OR files inside of directory ${
        userConfig.templateDirPath
      }`
    )
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
  const regExp = new RegExp(
    `\/\/.+pastry-start.+${name}(.|\n)+\/\/.+pastry-end.+${name}`,
    'igm'
  )

  await replace({
    files: fileName,
    from: regExp,
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

const serial = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  )

export async function findAndReplace(path, replacement, variantsToRemove) {
  const fileName = path.replace(/PLACEHOLDER/i, replacement)
  if (path !== fileName) {
    await rename(path, fileName)
  }

  await serial(
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

export async function getTemplateOptionals({ tempDirectoryPath }: IAnswers) {
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

export interface IOptions {
  template_name: string
  template_rename: string
  copy_path_affix: string
}

export interface IAnswers extends IOptions {
  templatePath: string
  temporaryCopyPath: string
  finalCopyPath: string
  tempDirectoryPath: string
}

export function calculateAnswers(
  options: IOptions,
  answersFromPrompt: IOptions
): IAnswers {
  const opts = {
    ...options,
    ...answersFromPrompt
  }

  let fileExtension: string | string[] = opts.template_name.split('.')
  fileExtension =
    fileExtension.length === 1
      ? ''
      : `.${fileExtension[fileExtension.length - 1]}`

  const answers = {
    ...opts,
    templatePath: `${userConfig.templateDirPath}/${opts.template_name}`,
    finalCopyPath: `${process.cwd()}/${opts.copy_path_affix}/${
      opts.template_rename
    }${fileExtension}`,
    temporaryCopyPath: `${tempDirectoryPath}/${opts.template_name}`,
    tempDirectoryPath
  }

  return answers
}
