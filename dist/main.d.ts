/// <reference types="replace-in-file" />
import { CLIAnswers, StringCasings } from './types';
export declare function getTemplates(): Promise<string[]>;
export declare function copyTemplateToTemporaryPath({ templatePath, temporaryCopyPath, }: CLIAnswers): any;
export declare function copyTemplateToFinalpath({ temporaryCopyPath, finalCopyPath, }: CLIAnswers): any;
export declare function renameFiles({ template_rename, temporaryCopyPath }: {
    template_rename: any;
    temporaryCopyPath: any;
}, variantsToRemove: any, replacementStrings?: StringCasings): Promise<void | void[]>;
export declare function removeOptional(fileName: string, name: string): Promise<void>;
export declare function removeAllOptionalComments(fileName: string): Promise<void>;
export declare function findAndReplace(path: string, replacement: string, variantsToRemove: string[], searchStrings?: StringCasings): Promise<void>;
export declare function removeFromFiles(files: any, regEx: any): Promise<import("replace-in-file").ReplaceResult[]>;
export declare function getTemplateOptionals({ tempDirectoryPath, }: CLIAnswers): Promise<string[]>;
export declare function createOrRemoveTempDir(): Promise<void>;
export declare function removePath(path: string): void;
export declare function getVariantsToRemove(answers: CLIAnswers): Promise<any[]>;
