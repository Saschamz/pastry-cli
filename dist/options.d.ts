export interface IUserConfig {
    templateDirPath: string;
}
export declare const userConfig: IUserConfig;
export declare function getOptions(rawArgs: any): {
    template_name: string;
    copy_path_affix: string;
    template_rename: string;
};
