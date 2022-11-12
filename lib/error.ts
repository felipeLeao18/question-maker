export const buildError = ({ statusCode, message }): { err: Error, statusCode: number, message: String } => {
  return {
    err: new Error(),
    statusCode,
    message
  }
}
