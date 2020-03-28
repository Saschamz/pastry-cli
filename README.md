# Pastry-CLI

This CLI aims to help speed up your workflow, guidelines and code reusability by adding support for pasting template building blocks.

Since it's not related to any specific frameworks or languages it can be used everywhere and for anything with minimal setup and full control.

## Installation

Install either inside your project `npm i pastry-cli` or globally `npm i -g pastry-cli`

## Setup/Usage

1. Create a `/pastries` directory in your project root.
2. Populate the directory with template files/folders.
3. run `pastry` inside your terminal while in the root directory of your project.

The cli will guide you through the rest of the steps.

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

## Available Arguments

`-n | --name` define the new name

`-p | --path` define the new path to paste the pastry into (from current working directory)

`-t | --template` specify the name of the template you want to use

`-h | --help` lists available commands

`-r | --rename` renames existing pastry

## Configuration

Configuration can be done by creating a `.pastryconfig.json` in the root directory for the project.

```json
{
  "templateDir": "{YOUR_TEMPLATE_DIRECTORY}" // default = pastries
}
```
