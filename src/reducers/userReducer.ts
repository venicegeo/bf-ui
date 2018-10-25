/**
 * Copyright 2016, RadiantBlue Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {types} from '../actions/userActions'
import * as session from '../api/session'

export interface UserState {
  isLoggedIn: boolean
  isSessionExpired: boolean
  isSessionLoggedOut: boolean
  catalogApiKey: string
  errors: any[]
}

export const userInitialState: UserState = {
  isLoggedIn: session.initialize(),
  isSessionExpired: false,
  isSessionLoggedOut: false,
  catalogApiKey: '',
  errors: [],
}

export function userReducer(state = userInitialState, action: any): UserState {
  switch (action.type) {
    case types.USER_DESERIALIZED:
      return {
        ...state,
        ...action.deserialized,
      }
    case types.USER_LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false,
        isSessionLoggedOut: true,
      }
    case types.USER_SESSION_CLEARED:
      return {
        ...state,
        isLoggedIn: false,
        isSessionExpired: false,
      }
    case types.USER_SESSION_LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false,
        isSessionLoggedOut: false,
      }
    case types.USER_SESSION_EXPIRED:
      return {
        ...state,
        isSessionExpired: true,
      }
    default:
      return state
  }
}
