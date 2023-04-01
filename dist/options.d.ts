import { CLIOptions } from './types';
export interface IUserConfig {
    templateDirName: string;
}
export declare const userConfig: IUserConfig;
export declare function getOptions(rawArgs: string[]): CLIOptions;
