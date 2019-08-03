declare const _default: {
    template_name: (choices: any) => {
        type: string;
        name: string;
        message: string;
        choices: any;
    };
    template_rename: {
        type: string;
        name: string;
        message: string;
    };
    copy_path_affix: {
        type: string;
        itemType: string;
        excludePath: (nodePath: any) => any;
        name: string;
        message: string;
    };
    selected_variants: (choices: any) => {
        name: string;
        type: string;
        choices: any;
        message: string;
    };
};
export default _default;
