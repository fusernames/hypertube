import { combineReducers } from 'redux'
import auth from './auth/auth.reducer'

const rootReducer = combineReducers({
  auth,
})

export default rootReducer
