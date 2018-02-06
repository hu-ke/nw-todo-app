
// code: 0-success, -1-fail, -2, unauthorized
export const resBody = function(code = -1, msg = 'response error', data = null) {
  return {
    code,
    msg,
    data
  }
}