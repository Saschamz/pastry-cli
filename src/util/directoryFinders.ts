import { userConfig } from '../options'

const path = require('node:path')
const findUp = require('find-up')

// This is a patch for an older version of findUp (5.0.0)
// When this project is updated to support pure ESM modules, this patch can be removed
function findUpPatch(file: string) {
  return new Promise(async (resolve, reject) => {
    await findUp(async directory => {
      const exists = (await findUp.exists(path.join(directory, file))) && directory
      if (exists) resolve(exists)
    })
    reject(new Error('No directory found'))
  })
}

export async function getPackageDirectory({ cwd } = {} as { cwd: string }) {
  const filePath = await findUp('package.json', { cwd })
  return filePath && path.dirname(filePath)
}

export async function getTemplatesDirectory() {
  const filePath = await findUpPatch(userConfig.templateDirName)
  return filePath + `/${userConfig.templateDirName}`
}
