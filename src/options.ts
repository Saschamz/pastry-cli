import arg from 'arg'

export interface IUserConfig {
  templateDirPath: string
}

export const userConfig = getUserConfig()

function getUserConfig(): IUserConfig {
  try {
    const config = require(`${process.cwd()}/.pastryconfig.json`)
    return {
      templateDirPath: process.cwd() + '/' + (config.templateDir || 'pastries')
    }
  } catch (err) {
    return {
      templateDirPath: process.cwd() + '/pastries'
    }
  }
}

export function getOptions(rawArgs) {
  const args = arg(
    {
      '--template': String,
      '--path': String,
      '--name': String,
      '--help': arg.COUNT,
      '-n': '--name',
      '-p': '--path',
      '-t': '--template',
      '-h': '--help'
    },
    {
      argv: rawArgs.slice(2)
    }
  )

  if ((args['--help'] as any) > 0) {
    console.log(`
      --template | -b) Specify template name
      --path | -p) Specify new relative path
      --name | -n) Specify new name
      --help | -h) See all available arguments
    `)
    process.exit(0)
  }

  return {
    template_name: args['--template'],
    copy_path_affix: args['--path'],
    template_rename: args['--name']
  }
}
