import { StringCasings } from '../types'

export const sequencePromises = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  )

export function getOptionalSnippetRegExp(name: string) {
  return new RegExp(
    `\/\/.+pastry-start.+${name}(.|\n)+\/\/.+pastry-end.+${name}`,
    'igm'
  )
}

export function getStringCasings(str: string): StringCasings {
  const upper = str.toUpperCase()
  const lower = str.toLowerCase()
  const pascal = `${str[0].toUpperCase()}${str.substr(1)}`

  return {
    default: str,
    upper,
    lower,
    pascal
  }
}
