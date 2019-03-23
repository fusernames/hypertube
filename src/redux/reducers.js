import { combineReducers } from 'redux'
import auth from './auth/reducer'
import locales from './locales/reducer'
import snackbars from './snackbars/reducer'
import search from './search/reducer'

const rootReducer = combineReducers({
  auth,
  locales,
  snackbars,
  search,
})

export default rootReducer
