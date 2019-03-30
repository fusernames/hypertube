import translations from './translations';
import Cookies from 'js-cookie'

function getLocale(code) {
  let locale = JSON.parse(JSON.stringify(translations));
  for (let key in locale) {
    for (let i in locale[key]) {
      locale[key][i] = locale[key][i][code]
    }
  }
  return locale
}

const EN = 0, FR = 1
const en = getLocale(EN)
const fr = getLocale(FR)
const locales = {en, fr}

const lang = Cookies.get('lang')

const initialState = {
  code: lang ? lang : 'en',
  locale: lang ? locales[lang] : en
}

function localesReducer(state = initialState, action) {
  if (action.type === 'SET_FRENCH') {
    return {
      code: 'fr',
      locale: fr
    }
  } else if (action.type === 'SET_ENGLISH') {
    return {
      code: 'en',
      locale: en
    }
  } else {
    return state
  }
}

export default localesReducer
