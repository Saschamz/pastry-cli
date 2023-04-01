import chalk from 'chalk'

export default {
  welcome: () => console.log(chalk.magentaBright('🎂 Pastry')),
  success: (template_rename: string) =>
    console.log(chalk.greenBright(`🎂 Pasted ${template_rename}!`)),
  success_rename: (path: string, template_rename: string) =>
    console.log(chalk.greenBright(`🎂 Renamed ${path} to ${template_rename}!`)),
  error: (...reasons: string[]) => console.error(chalk.red(...reasons)),
  errorDirectoryOrFilesNotFound: () =>
    console.error(
      chalk.red.bold('🎂 ERROR'),
      `Could not find directory or files inside of the project. Make sure they are placed at the root of your project.`
    ),
}
