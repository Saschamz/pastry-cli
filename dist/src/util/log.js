import chalk from 'chalk';
import { userConfig } from '../options';
export default {
    welcome: () => console.log(chalk.magentaBright('🎂 Pastry')),
    success: (template_rename) => console.log(chalk.greenBright(`🎂 Pasted ${template_rename}!`)),
    success_rename: (path, template_rename) => console.log(chalk.greenBright(`🎂 Renamed ${path} to ${template_rename}!`)),
    error: (...reasons) => console.error(chalk.red(...reasons)),
    errorDirectoryOrFilesNotFound: () => console.error(chalk.red.bold('🎂 ERROR'), `Could not find directory OR files inside of directory ${userConfig.templateDirPath}`)
};
