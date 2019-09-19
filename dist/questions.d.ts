declare const _default: {
    template_name: (choices: string[]) => {
        type: string;
        name: string;
        message: string;
        choices: string[];
    };
    template_rename: {
        type: string;
        name: string;
        message: string;
    };
    copy_path_affix: {
        type: string;
        itemType: string;
        excludePath: (nodePath: string) => boolean;
        name: string;
        message: string;
    };
    selected_variants: (choices: string[]) => {
        name: string;
        type: string;
        choices: string[];
        message: string;
    };
};
export default _default;
