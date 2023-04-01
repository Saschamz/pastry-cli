import fs from 'fs'
import ncp from 'ncp'
import { promisify } from 'util'

export const readdir = promisify(fs.readdir)
export const copy = promisify(ncp)
export const rename = promisify(fs.rename)
export const stats = promisify(fs.stat)
export const access = promisify(fs.access)
export const readfile = promisify(fs.readFile)
export const exists = promisify(fs.exists)
export const mkdir = promisify(fs.mkdir)
export const rmdir = promisify(fs.rmdir)
