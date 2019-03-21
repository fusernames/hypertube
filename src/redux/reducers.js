import { combineReducers } from 'redux'
import auth from './auth/reducer'
import locales from './locales/reducer'
import snackbars from './snackbars/reducer'

const rootReducer = combineReducers({
  auth,
  locales,
  snackbars,
})

export default rootReducer
