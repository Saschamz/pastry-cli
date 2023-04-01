import arg from 'arg';
export const userConfig = getUserConfig();
function getUserConfig() {
    try {
        const config = require(`${process.cwd()}/.pastryconfig.json`);
        return {
            templateDirPath: `${process.cwd()}/${config.templateDir || 'pastries'}`,
        };
    }
    catch (error) {
        return {
            templateDirPath: `${process.cwd()}/pastries`,
        };
    }
}
export function getOptions(rawArgs) {
    const args = arg({
        '--template': String,
        '--path': String,
        '--name': String,
        '--help': arg.COUNT,
        '--rename': arg.COUNT,
        '-n': '--name',
        '-p': '--path',
        '-t': '--template',
        '-h': '--help',
        '-r': '--rename',
    }, {
        argv: rawArgs.slice(2),
    });
    if (args['--help'] > 0) {
        console.log(`
      --rename | -r) Rename existing pastry
      --template | -b) Specify template name
      --path | -p) Specify new relative path
      --name | -n) Specify new name
      --help | -h) See all available arguments
    `);
        process.exit(0);
    }
    return {
        template_name: args['--template'],
        copy_path_affix: args['--path'],
        template_rename: args['--name'],
        rename_existing: args['--rename'],
    };
}
