const checkForm = (datas, validate, callback) => {
  let errors = {}
  let nbErrors = 0
  for (let k in datas) {
    errors[k] = validate(k)
    if (errors[k].length)
      nbErrors++
  }
  if (callback) callback(errors, nbErrors)
}

export default checkForm
