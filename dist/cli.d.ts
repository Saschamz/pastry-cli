import { CLIAnswers } from './types';
export declare function cli(rawArgs: string[]): Promise<void>;
export declare function createFlow(answers: CLIAnswers): Promise<void>;
export declare function renameFlow(answers: CLIAnswers): Promise<void>;
