export const buildError = ({ statusCode, message }): { err: Error, statusCode: number, message: String } => ({
  err: new Error(),
  statusCode,
  message
})

export const unauthorizedError = () => ({
  err: new Error(),
  statusCode: 401,
  message: 'Unauthorized'
})

export const invalidOrderError = (maxOrder: number) => ({
  err: new Error(),
  statusCode: 412,
  message: `order must be between 1 and ${maxOrder}`
})

export const invalidSchemaError = (notProvidedData: string) => ({
  err: new Error(),
  statusCode: 422,
  message: `${notProvidedData} not provided`
})
