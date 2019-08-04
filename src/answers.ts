import { userConfig } from './options'
import { tempDirectoryPath } from './constants'

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
