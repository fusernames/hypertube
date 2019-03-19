export const login = (data) => {
    let payload = data.username;
    return {type: 'LOGIN',  payload}
}
