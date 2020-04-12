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
}
