import { combineReducers } from 'redux'
import auth from './auth/auth.reducer'
import locales from './locales/locales.reducer'

const rootReducer = combineReducers({
  auth,
  locales,
})

export default rootReducer
