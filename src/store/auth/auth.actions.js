export function login(data) {
  let username = data.username
  let password = data.password
  return {type: 'LOGIN', user: data}
}

export function logout() {
  return {type: 'LOGOUT'}
}
