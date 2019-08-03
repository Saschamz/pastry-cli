import chalk from 'chalk'
import replace from 'replace-in-file'
import findInFiles from 'find-in-files'

import {
  copy,
  readdir,
  rename,
  stats,
  mkdir,
  exists,
  rmdir
} from './promisified'
import { userConfig } from './options'

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

export async function copyTemplate({
  template_name,
  template_rename,
  copy_path_affix
}) {
  // TODO: create temp directory
  const templatePath = `${userConfig.templateDirPath}/${template_name}`
  let fileExtension = template_name.split('.')
  fileExtension =
    fileExtension.length === 1
      ? ''
      : `.${fileExtension[fileExtension.length - 1]}`
  const copyPath = `${process.cwd()}/${copy_path_affix}/${template_rename}${fileExtension}`

  await copy(templatePath, copyPath, { clobber: false })
  return copyPath
}

export async function renameFiles({ template_rename, path }) {
  const stat = await stats(path)
  const isDirectory = stat.isDirectory()

  if (!isDirectory) return await findAndReplace(path, template_rename)

  const filePaths = await getNestedFilePaths(path)

  return await Promise.all(
    filePaths.map(path => findAndReplace(path, template_rename))
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

// TODO: replace directory names
// TODO: replace nested file names
export async function findAndReplace(path, replacement) {
  const fileName = path.replace(/PLACEHOLDER/i, replacement)
  if (path !== fileName) {
    await rename(path, fileName)
  }

  // await replace({
  //   files: fileName,
  //   from: /\/\*.{0,2}pastry-optional(.|[\r\n])+\*\//gim,
  //   to: ''
  // })

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

export async function getTemplateOptionals(path) {
  const files = await findInFiles.find('pastry-optional', path, '.')
  console.log('found files:', files)

  // const massagedFiles = Object.values(files).map((value, i) => {
  //   const path = Object.keys(files)[i]

  //   return {
  //     path,
  //     value,
  //     lines: value.line.flat()
  //   }
  // })

  // console.log(massagedFiles)

  const lines = Object.values(files)
    .map((file: any) => file.line)
    //@ts-ignore
    .flat()
  const templateOptionals = lines.map(line =>
    line.split('pastry-optional:')[1].trim()
  )

  return templateOptionals
}

export async function createTempDir() {
  const tempDirExists = await exists(`${userConfig.templateDirPath}/__temp`)
  if (!tempDirExists) await mkdir(`$${userConfig.templateDirPath}/__temp`)
}

export async function removeTempDir() {
  return await rmdir(`${userConfig.templateDirPath}/__temp`)
}
