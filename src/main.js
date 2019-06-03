import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import { promisify } from 'util'
import replace from 'replace-in-file'

const readdirSync = promisify(fs.readdir)
const copy = promisify(ncp)
const rename = promisify(fs.rename)
const stats = promisify(fs.stat)

export async function getTemplates() {
  try {
    const templateDir = process.cwd() + '/blueprints'
    const templates = await readdirSync(templateDir)
    if (!templates.length) throw Error
    return templates
  } catch (err) {
    console.error(
      chalk.red.bold(
        'ERROR: Could not find directory OR files inside of directory /blueprints\n'
      )
    )
    process.exit(1)
  }
}

export async function copyTemplate({
  template_name,
  template_rename,
  copy_path_affix
}) {
  const templatePath = process.cwd() + '/blueprints/' + template_name
  const copyPath = process.cwd() + '/' + copy_path_affix + '/' + template_rename
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
    files = fs.readdirSync(dir)
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
