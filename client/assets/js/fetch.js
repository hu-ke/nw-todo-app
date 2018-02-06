var baseURL = 'http://106.14.42.193:3000'

// sync
var fetchData = function(method, url, data) {
  
  var xhr = new XMLHttpRequest()

  method = method || 'get'
  xhr.open(method, baseURL + url, false)

  if (data.token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + data.token)
  }
  if (method === 'post') {
    xhr.setRequestHeader('Content-type', 'application/json')
    data = JSON.stringify(data)
  }
  
  xhr.send(data)

  return JSON.parse(xhr.responseText)
}




