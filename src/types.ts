export type StringCasings = {
  default: string
  lower: string
  upper: string
  pascal: string
}

export type CLIOptions = {
  template_name: string
  template_rename: string
  copy_path_affix: string
  rename_existing: number
}

export type CLIAnswers = CLIOptions & {
  templatePath: string
  temporaryCopyPath: string
  finalCopyPath: string
  tempDirectoryPath: string
  isGist: boolean
}

export enum TemplateSource {
  GIST = 'gist',
  LOCAL = 'local',
}

export type GithubFile = {
  filename: string
  type: string
  language: string
  raw_url: string
  size: number
}
