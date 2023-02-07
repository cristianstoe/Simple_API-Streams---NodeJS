export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const PathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return PathRegex
  // console.log(Array.from(path.matchAll(routeParametersRegex)))
}
