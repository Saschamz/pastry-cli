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
