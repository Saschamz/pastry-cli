export declare function getTemplates(): Promise<string[]>;
export declare function copyTemplate({ template_name, template_rename, copy_path_affix }: {
    template_name: any;
    template_rename: any;
    copy_path_affix: any;
}): Promise<string>;
export declare function renameFiles({ template_rename, path }: {
    template_rename: any;
    path: any;
}): Promise<import("replace-in-file").ReplaceResult[] | [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
export declare function findAndReplace(path: any, replacement: any): Promise<import("replace-in-file").ReplaceResult[]>;
export declare function removeFromFiles(files: any, regEx: any): Promise<import("replace-in-file").ReplaceResult[]>;
export declare function getTemplateOptionals(path: any): Promise<any>;
export declare function createTempDir(): Promise<void>;
export declare function removeTempDir(): Promise<void>;
