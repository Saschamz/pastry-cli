import axios from 'axios'
import findInFiles from 'find-in-files'
import fsx from 'fs-extra'
import glob from 'glob'
import inquirer from 'inquirer'
import replace from 'replace-in-file'
import { tempDirectoryPath } from './constants'
import { userConfig } from './options'
import questions from './questions'
import octokit from './services/octokit'
import { CLIAnswers, GithubFile, StringCasings } from './types'
import { getOptionalSnippetRegExp, getStringCasings, sequencePromises } from './util/helpers'
import log from './util/log'
import { copy, exists, mkdir, readdir, rename, stats, writeFile } from './util/promisified'

export async function getLocalTemplates() {
  try {
    const templates = await readdir(userConfig.templateDirPath)
    return templates.map(t => `📦 ${t}`)
  } catch (err) {
    console.log('WIP ERROR FETCHING LOCAL TEMPLATES')
    return []
  }
}

// TODO: Implement remote template fetching
// https://docs.github.com/en/rest/reference/gists#list-a-users-gists
// https://api.github.com/users/saschamz/gists

export async function fetchGistTemplate(username: string) {
  try {
    const { data } = await octokit.request('GET /users/{username}/gists', { username })

    return data.map(t => ({ ...t, description: `⭐ ${t.description} (${username})` }))
  } catch (err) {
    console.log('WIP ERROR FETCHING GIST TEMPLATES')
    return []
  }
}

export async function getGistTemplates() {
  const promises = userConfig.userGists.map(fetchGistTemplate)
  const responses = (await Promise.all(promises)).flat()

  return responses
}

export async function downloadGithubFilesToTemporaryPath(
  answers: CLIAnswers,
  files: Record<string, GithubFile>
) {
  const { copy_path_affix } = answers
  const isMultipleFiles = Object.keys(files).length > 1
  console.log('downloadGithubFilesToTemporaryPath', answers)
  console.log('isMultipleFiles', isMultipleFiles)
  const filesArr = Object.values(files)

  const fetchActions = filesArr.map(file => axios.get(file.raw_url))
  const responses = await Promise.all(fetchActions)
  const filePathPrefix = isMultipleFiles
    ? `${copy_path_affix}/${answers.template_name}`
    : `${copy_path_affix}`

  if (isMultipleFiles) {
    await mkdir(filePathPrefix)
  }

  const writeActions = responses.map((file, index) => {
    console.log('writing temp github file', `${filePathPrefix}/${filesArr[index].filename}`)
    return writeFile(`${filePathPrefix}/${filesArr[index].filename}`, file.data, {
      encoding: 'utf8',
    })
  })

  return await Promise.all(writeActions)
}

export function copyTemplateToTemporaryPath({ templatePath, temporaryCopyPath }: CLIAnswers) {
  return copy(templatePath, temporaryCopyPath, { clobber: false })
}

export function copyTemplateToFinalpath({ temporaryCopyPath, finalCopyPath }: CLIAnswers) {
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
        return findAndReplace(path, template_rename, variantsToRemove, replacementStrings)
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
      resolve(response.filter(path => /.+\..+/.test(path.split('/').reverse()[0])))
    })
  })
}

export async function removeOptional(fileName: string, name: string) {
  await replace({
    files: fileName,
    from: getOptionalSnippetRegExp(name),
    to: '',
  }).catch(error => log.error(error.message))
}

export async function removeAllOptionalComments(fileName: string) {
  const regExp = new RegExp(`\/\/.+pastry.+`, 'ig')

  await replace({
    files: fileName,
    from: regExp,
    to: '',
  }).catch(error => log.error(error.message))
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

    await sequencePromises(variantsToRemove.map(variant => () => removeOptional(fileName, variant)))

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

export async function getTemplateOptionals({ tempDirectoryPath }: CLIAnswers): Promise<string[]> {
  try {
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
  } catch (error) {
    log.error('Error getting template optionals', error.message)
  }
}

export async function createOrRemoveTempDir() {
  try {
    const tempDirExists = await exists(tempDirectoryPath)
    if (!tempDirExists) return await mkdir(tempDirectoryPath)
    removePath(tempDirectoryPath)
  } catch (error) {
    log.error('Error creating/removing temporary directory', error.message)
  }
}

export function removePath(path: string) {
  fsx.removeSync(path)
}

export async function getVariantsToRemove(answers: CLIAnswers) {
  try {
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
  } catch (error) {
    log.error('Error getting available variants', error.message)
  }
}
