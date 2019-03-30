import Cookies from 'js-cookie'

export function toggleLanguage() {
  return (dispatch, getState) => {
    const { code } = getState().locales
    if (code === 'fr') dispatch(setEnglish())
    else if (code === 'en') dispatch(setFrench())
  }

  function setEnglish() {
    Cookies.set('lang', 'en')
    return {type: 'SET_ENGLISH'}
  }
  function setFrench() {
    Cookies.set('lang', 'fr')
    return {type: 'SET_FRENCH'}
  }
}
