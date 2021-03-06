/**
 * Copyright 2018, RadiantBlue Technologies, Inc.
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

import {ApiStatusActions as Actions} from '../actions/apiStatusActions'
import {Action} from 'redux'
import {RequestError} from '../utils/requestError'

export interface ApiStatusState {
  readonly geoserver: {
    readonly wmsUrl: string | null
  }
  readonly enabledPlatforms: string[]
  readonly isFetching: boolean
  readonly fetchError: RequestError | null
}

export const apiStatusInitialState: ApiStatusState = {
  geoserver: {
    wmsUrl: null,
  },
  enabledPlatforms: [],
  isFetching: false,
  fetchError: null,
}

export function apiStatusReducer(state = apiStatusInitialState, action: Action): ApiStatusState {
  switch (action.type) {
    case Actions.Fetching.type:
      return {
        ...state,
        isFetching: true,
        fetchError: null,
      }
    case Actions.FetchSuccess.type: {
      const payload = (action as Actions.FetchSuccess).payload
      return {
        ...state,
        isFetching: false,
        geoserver: payload.geoserver,
        enabledPlatforms: payload.enabledPlatforms,
      }
    }
    case Actions.FetchError.type: {
      const payload = (action as Actions.FetchError).payload
      return {
        ...state,
        isFetching: false,
        fetchError: payload.error,
      }
    }
    case Actions.Deserialized.type: {
      const payload = (action as Actions.Deserialized).payload
      return {
        ...state,
        geoserver: payload.geoserver,
        enabledPlatforms: payload.enabledPlatforms,
      }
    }
    default:
      return state
  }
}
