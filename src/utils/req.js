import store from '../redux/store'

const req = (url, body) => {
  let params = {}
  if (body) {
    params = {
      'Content-Type': 'application/json',
      body: JSON.stringify(body)
    }
  }
  return new Promise((resolve, reject) => {
    fetch(url, params)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success !== undefined)
            resolve(json.success)
          else {
            store.dispatch(enqueueSnackbar(json.error))
            reject()
          }
        })
      } else {
        console.error(response.statusText)
        reject()
      }
    })
    .catch(err => {
      console.error(response.statusText)
      reject()
    })
  })
}

export default req
