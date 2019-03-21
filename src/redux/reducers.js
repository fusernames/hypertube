import { combineReducers } from 'redux'
import auth from './auth/auth.reducer'
import locales from './locales/locales.reducer'
import snackbars from './snackbars/snackbars.reducer'

const rootReducer = combineReducers({
  auth,
  locales,
  snackbars,
})

export default rootReducer
