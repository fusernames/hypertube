export function toggleLanguage(code) {
  if (code === 'FR') {
    return {type: 'SET_ENGLISH'}
  } else if (code === 'EN') {
    return {type: 'SET_FRENCH'}
  }
}
