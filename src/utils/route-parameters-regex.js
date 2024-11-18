export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)') // outra regex, estamos passando o que podemos incluir de texto no lugar do parâmetro dinâmico
  
  const pathRegex = new RegExp(`^${pathWithParams}`)// ^ validando que começa com pathWithParams
  return pathRegex
}