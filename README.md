# Pastry-CLI

This CLI aims to help speed up your workflow, guidelines and code reusability by adding support for pasting template building blocks.

Since it's language agnostic it can be used anywhere with minimal setup.

![A gif showing pastry-cli](https://imgur.com/p2JNoZN.gif)

## Installation

Install with NPM:

```bash
npm i -g pastry-cli
```

Install with Yarn:

```bash
yarn global add pastry-cli
```

## Setup/Usage

1. Create a `/pastries` directory in your project source directory.
2. Populate the directory with template files/folders.
3. Run `pastry` inside your terminal while located inside your project.

The cli will guide you through the rest of the steps.

It will look up for a `/pastries` directory starting from your `cwd`.

This means that you can have default pastries for all projects by placing them in a parent directory.

## Name replacement

You can replace any text including filenames with the name you provide when running pastry.

For example: running `pastry -n testFile` would change the following:

`PLACEHOLDER.ts` ~> `testFile.ts`

When changing text inside a file you have more options:

`export default PLACEHOLDER'` ~> `export default testFile`

`export default UPPER_PLACEHOLDER'` ~> `export default TESTFILE`

`export default LOWER_PLACEHOLDER'` ~> `export default testfile`

`export default PASCAL_PLACEHOLDER'` ~> `export default TestFile`

## Optional Snippets

With optional snippets you can predefine parts of code you **might** want to use in a file.
For example this will prompt you if you want to include the `log` snippet:

```javascript
// pastry-start log
console.log('I may be part of the file, yay!')
// pastry-end log
```

## Renaming existing files

By running `pastry --rename` you can rename existing files.
Currently, there is only support to rename together with the parent directory.
The name of the directory will be used as `PLACEHOLDER` is used normally.

## Available arguments

| Argument   | Shorthand | Description                 |
| ---------- | --------- | --------------------------- |
| --name     | -n        | Define the new name         |
| --path     | -p        | Define the target path      |
| --template | -t        | Name of the template to use |
| --rename   | -r        | Rename existing             |
| --help     | -h        | List available arguments    |

## Configuration

Configuration can be done by creating a `.pastryconfig.json` in the root directory for the project.

```json
{
  "templateDir": "{YOUR_TEMPLATE_DIRECTORY}" // default: pastries
}
```
