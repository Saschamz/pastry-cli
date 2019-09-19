import { IAnswers } from './answers';
export declare function getTemplates(): Promise<string[]>;
export declare function copyTemplateToTemporaryPath({ templatePath, temporaryCopyPath }: IAnswers): Promise<void>;
export declare function copyTemplateToFinalpath({ temporaryCopyPath, finalCopyPath }: IAnswers): Promise<void>;
export declare function renameFiles({ template_rename, temporaryCopyPath }: {
    template_rename: any;
    temporaryCopyPath: any;
}, variantsToRemove: any): Promise<import("replace-in-file").ReplaceResult[] | [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
export declare function removeOptional(fileName: any, name: string): Promise<void>;
export declare function removeAllOptionalComments(fileName: any): Promise<void>;
export declare function findAndReplace(path: any, replacement: any, variantsToRemove: any): Promise<import("replace-in-file").ReplaceResult[]>;
export declare function removeFromFiles(files: any, regEx: any): Promise<import("replace-in-file").ReplaceResult[]>;
export declare function getTemplateOptionals({ tempDirectoryPath }: IAnswers): Promise<string[]>;
export declare function createOrRemoveTempDir(): Promise<void>;
export declare function getVariantsToRemove(answers: IAnswers): Promise<any[]>;
