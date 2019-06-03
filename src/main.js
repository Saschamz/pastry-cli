import chalk from 'chalk'
import replace from 'replace-in-file'

import { copy, readdir, rename, stats } from './promisified'
import { userConfig } from './options'

export async function getTemplates() {
  try {
    const templateDirPath = `${process.cwd()}/${userConfig.templateDir}`
    const templates = await readdir(templateDirPath)
    if (!templates.length) throw Error
    return templates
  } catch (err) {
    console.error(
      chalk.red.bold('🎂 ERROR'),
      `Could not find directory OR files inside of directory ${
        userConfig.templateDir
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
  const templatePath = `${process.cwd()}/${
    userConfig.templateDir
  }/${template_name}`
  const copyPath = `${process.cwd()}/${copy_path_affix}/${template_rename}`

  await copy(templatePath, copyPath, { clobber: false })
  return copyPath
}

export async function renameFiles({ template_rename, path }) {
  const stat = await stats(path)
  const isDirectory = stat.isDirectory()

  if (!isDirectory) return

  const filePaths = getNestedFilePaths(path)

  return await Promise.all(
    filePaths.map(path => findAndReplace(path, template_rename))
  )
}

const getNestedFilePaths = function(dir, filelist) {
  var path = path || require('path')
  var fs = fs || require('fs'),
    files = fs.readdir(dir)
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
  return await replace({
    files: fileName,
    from: /PLACEHOLDER/g,
    to: replacement
  })
}
