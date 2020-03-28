import { tempDirectoryPath } from './constants'
import { userConfig } from './options'

export interface IOptions {
  template_name: string
  template_rename: string
  copy_path_affix: string
  rename_existing: number
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

  let fileExtension: string | string[] = (opts.template_name || '').split('.')
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

  if (opts.rename_existing) {
    const existingName = answers.copy_path_affix.split('/').reverse()[0]

    answers.templatePath = `${process.cwd()}/${opts.copy_path_affix}`
    answers.temporaryCopyPath = `${tempDirectoryPath}/${existingName}`

    const p1 = opts.copy_path_affix.split('/').reverse()
    p1.shift()
    p1.reverse()
    const p2 = p1.join('')

    answers.finalCopyPath = `${process.cwd()}/${p2}/${
      opts.template_rename
    }${fileExtension}`
  }

  return answers
}
