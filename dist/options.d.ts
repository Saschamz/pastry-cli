export declare const userConfig: {
    templateDir: any;
    templateDirPath: string;
} | {
    templateDirPath: string;
    templateDir?: undefined;
};
export declare function getOptions(rawArgs: any): {
    template_name: string;
    copy_path_affix: string;
    template_rename: string;
};
