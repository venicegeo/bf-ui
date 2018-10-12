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

import {types} from '../actions/catalogActions'

export interface CatalogState {
  apiKey: string
}

const initialState = {
  apiKey: localStorage.getItem('catalog_apiKey') || '',
}

export class CatalogReducer {
  static readonly initialState = initialState

  static reduce(state = initialState, action: any): CatalogState {
    switch (action.type) {
      case types.CATALOG_API_KEY_CHANGED:
        console.log('CATALOG_API_KEY_CHANGED')
        return {
          ...state,
          apiKey: action.apiKey,
        }
      default:
        return state
    }
  }
}
