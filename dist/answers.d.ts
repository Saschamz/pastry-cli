export interface IOptions {
    template_name: string;
    template_rename: string;
    copy_path_affix: string;
}
export interface IAnswers extends IOptions {
    templatePath: string;
    temporaryCopyPath: string;
    finalCopyPath: string;
    tempDirectoryPath: string;
}
export declare function calculateAnswers(options: IOptions, answersFromPrompt: IOptions): IAnswers;
