# Blueprint-Paster-CLI

This cli helps speed up your workflow, project guideliens and code reusability by adding support for pasting blueprint building blocks.

## Installation

Install either to your project `npm i blueprint-paster-cli` or globally `npm i -g blueprint-paster-cli`

## Setup/Usage

1. Create a `/blueprints` directory in your project root.
2. Populate the blueprints directory with template files/folders.
3. run `bpp` | `blueprint-paster` | `blueprint-paster-cli` inside your terminal while standing in the root directory of your project.

The cli will guide you through the rest of the steps.

## Available Arguments

`-n | --name` -> define the new name

`-p | --path` -> define the new path to paste the blueprint into (from current working directory)

`-b | --blueprint` -> specify the name of the blueprint you want to use

`-h | --help` -> lists available commands
