import findInFiles from 'find-in-files';
import fsx from 'fs-extra';
import glob from 'glob';
import inquirer from 'inquirer';
import replace from 'replace-in-file';
import { tempDirectoryPath } from './constants';
import questions from './questions';
import { getTemplatesDirectory } from './util/directoryFinders';
import { getOptionalSnippetRegExp, getStringCasings, sequencePromises } from './util/helpers';
import log from './util/log';
import { copy, exists, mkdir, readdir, rename, stats } from './util/promisified';
export async function getTemplates() {
    try {
        const path = await getTemplatesDirectory();
        console.log('templatesPath', path);
        const templates = await readdir(path);
        if (!templates.length)
            throw Error;
        return { templates, path };
    }
    catch (err) {
        console.log('error', err);
        log.errorDirectoryOrFilesNotFound();
        process.exit(1);
    }
}
export function copyTemplateToTemporaryPath({ templatePath, temporaryCopyPath }) {
    return copy(templatePath, temporaryCopyPath, { clobber: false });
}
export function copyTemplateToFinalpath({ temporaryCopyPath, finalCopyPath }) {
    return copy(temporaryCopyPath, finalCopyPath, { clobber: false });
}
export async function renameFiles({ template_rename, temporaryCopyPath }, variantsToRemove, replacementStrings) {
    try {
        const stat = await stats(temporaryCopyPath);
        const isDirectory = stat.isDirectory();
        if (!isDirectory) {
            return await findAndReplace(temporaryCopyPath, template_rename, variantsToRemove, replacementStrings);
        }
        const filePaths = await getNestedFilePaths(temporaryCopyPath);
        return await Promise.all(filePaths.map((path) => {
            return findAndReplace(path, template_rename, variantsToRemove, replacementStrings);
        }));
    }
    catch (error) {
        log.error('Error renaming files', error.message);
    }
}
const getNestedFilePaths = async function (dir) {
    return new Promise((resolve, reject) => {
        glob(dir + '/**/*', (error, response) => {
            if (error)
                return reject(error);
            resolve(response.filter(path => /.+\..+/.test(path.split('/').reverse()[0])));
        });
    });
};
export async function removeOptional(fileName, name) {
    await replace({
        files: fileName,
        from: getOptionalSnippetRegExp(name),
        to: '',
    }).catch(error => log.error(error.message));
}
export async function removeAllOptionalComments(fileName) {
    const regExp = new RegExp(`\/\/.+pastry.+`, 'ig');
    await replace({
        files: fileName,
        from: regExp,
        to: '',
    }).catch(error => log.error(error.message));
}
export async function findAndReplace(path, replacement, variantsToRemove, searchStrings = {
    default: 'PLACEHOLDER',
    lower: 'LOWER_PLACEHOLDER',
    upper: 'UPPER_PLACEHOLDER',
    pascal: 'PASCAL_PLACEHOLDER',
}) {
    const fileNameRegExp = new RegExp(searchStrings.default + '(?=\\.)', 'i');
    const defaultRegExp = new RegExp(searchStrings.default, 'g');
    const upperRegExp = new RegExp(searchStrings.upper, 'g');
    const lowerRegExp = new RegExp(searchStrings.lower, 'g');
    const pascalRegExp = new RegExp(searchStrings.pascal, 'g');
    const fileName = path.replace(fileNameRegExp, replacement);
    try {
        if (path !== fileName) {
            await rename(path, fileName);
        }
        await sequencePromises(variantsToRemove.map(variant => () => removeOptional(fileName, variant)));
        await removeAllOptionalComments(fileName);
        const replacements = getStringCasings(replacement);
        await replace({
            files: fileName,
            from: upperRegExp,
            to: replacements.upper,
        });
        await replace({
            files: fileName,
            from: lowerRegExp,
            to: replacements.lower,
        });
        await replace({
            files: fileName,
            from: pascalRegExp,
            to: replacements.pascal,
        });
        await replace({
            files: fileName,
            from: defaultRegExp,
            to: replacements.default,
        });
    }
    catch (error) {
        log.error('Error replacing file names/values', error.message);
    }
}
export async function removeFromFiles(files, regEx) {
    return await replace({
        files,
        from: regEx,
        to: '',
    });
}
export async function getTemplateOptionals({ tempDirectoryPath }) {
    try {
        const files = await findInFiles.find('pastry-start', tempDirectoryPath, '.');
        const lines = Object.values(files)
            .map((file) => file.line)
            //@ts-ignore
            .flat();
        const templateOptionals = lines
            .map((line) => line.split('pastry-start'))
            .filter((words) => words.length >= 2)
            .map((words) => words[1].trim())
            .filter(Boolean);
        return Array.from(new Set(templateOptionals));
    }
    catch (error) {
        log.error('Error getting template optionals', error.message);
    }
}
export async function createOrRemoveTempDir() {
    try {
        const tempDirExists = await exists(tempDirectoryPath);
        if (!tempDirExists)
            return await mkdir(tempDirectoryPath);
        removePath(tempDirectoryPath);
    }
    catch (error) {
        log.error('Error creating/removing temporary directory', error.message);
    }
}
export function removePath(path) {
    fsx.removeSync(path);
}
export async function getVariantsToRemove(answers) {
    try {
        const availableTemplateVariants = await getTemplateOptionals(answers);
        let variantsToRemove = [];
        if (availableTemplateVariants.length) {
            const { selected_variants } = await inquirer.prompt(questions.selected_variants(availableTemplateVariants));
            variantsToRemove = availableTemplateVariants.filter(variant => !selected_variants.includes(variant));
        }
        return variantsToRemove;
    }
    catch (error) {
        log.error('Error getting available variants', error.message);
    }
}
