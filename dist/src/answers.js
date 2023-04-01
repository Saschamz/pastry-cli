import { tempDirectoryPath } from './constants';
export function calculateAnswers(options, answersFromPrompt, templatesPath) {
    const opts = {
        ...options,
        ...answersFromPrompt,
    };
    let fileExtension = (opts.template_name || '').split('.');
    fileExtension = fileExtension.length === 1 ? '' : `.${fileExtension[fileExtension.length - 1]}`;
    const answers = {
        ...opts,
        templatePath: `${templatesPath}/${opts.template_name}`,
        finalCopyPath: `${process.cwd()}/${opts.copy_path_affix}/${opts.template_rename}${fileExtension}`,
        temporaryCopyPath: `${tempDirectoryPath}/${opts.template_name}`,
        tempDirectoryPath,
    };
    if (opts.rename_existing) {
        const existingName = answers.copy_path_affix.split('/').reverse()[0];
        answers.templatePath = `${process.cwd()}/${opts.copy_path_affix}`;
        answers.temporaryCopyPath = `${tempDirectoryPath}/${existingName}`;
        const p1 = opts.copy_path_affix.split('/').reverse();
        p1.shift();
        p1.reverse();
        const p2 = p1.join('');
        answers.finalCopyPath = `${process.cwd()}/${p2}/${opts.template_rename}${fileExtension}`;
    }
    return answers;
}
