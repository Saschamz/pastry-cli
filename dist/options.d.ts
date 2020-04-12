import { CLIOptions } from './types';
export interface IUserConfig {
    templateDirPath: string;
}
export declare const userConfig: IUserConfig;
export declare function getOptions(rawArgs: string[]): CLIOptions;
