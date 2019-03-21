import translations from './translations';

function getLocale(code) {
  let locale = JSON.parse(JSON.stringify(translations));
  for (let key in locale) {
    for (let i in locale[key]) {
      locale[key][i].splice(code, 1)
    }
  }
  return locale
}

const EN = 1, FR = 0
const en = getLocale(EN)
const fr = getLocale(FR)

const initialState = {
  code: 'EN',
  locale: en
}

function localesReducer(state = initialState, action) {
  if (action.type === 'SET_FRENCH') {
    return {
      code: 'FR',
      locale: fr
    }
  } else if (action.type === 'SET_ENGLISH') {
    return {
      code: 'EN',
      locale: en
    }
  } else {
    return state
  }
}

export default localesReducer
