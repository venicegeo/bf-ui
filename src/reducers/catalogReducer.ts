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

import {catalogTypes} from '../actions/catalogActions'
import {mapTypes} from '../actions/mapActions'
import * as moment from 'moment'
import {SOURCE_DEFAULT} from '../constants'

const DATE_FORMAT = 'YYYY-MM-DD'

export interface CatalogState {
  apiKey: string
  isSearching: boolean
  searchCriteria: {
    cloudCover: number
    dateFrom: string
    dateTo: string
    source: string
  },
  searchError: any
  searchResults: beachfront.ImageryCatalogPage | null
}

export const catalogInitialState: CatalogState = {
  apiKey: '',
  isSearching: false,
  searchCriteria: {
    cloudCover: 10,
    dateFrom: moment().subtract(30, 'days').format(DATE_FORMAT),
    dateTo: moment().format(DATE_FORMAT),
    source: SOURCE_DEFAULT,
  },
  searchError: null,
  searchResults: null,
}

export function catalogReducer(state = catalogInitialState, action: any): CatalogState {
  switch (action.type) {
    case catalogTypes.CATALOG_DESERIALIZED:
      return {
        ...state,
        ...action.deserialized,
      }
    case catalogTypes.CATALOG_API_KEY_UPDATED:
      return {
        ...state,
        apiKey: action.apiKey,
      }
    case catalogTypes.CATALOG_SEARCH_CRITERIA_UPDATED:
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          ...action.searchCriteria,
        },
      }
    case catalogTypes.CATALOG_SEARCH_CRITERIA_RESET:
      return {
        ...state,
        searchCriteria: catalogInitialState.searchCriteria,
      }
    case catalogTypes.CATALOG_SEARCHING:
      return {
        ...state,
        isSearching: true,
        searchError: null,
      }
    case catalogTypes.CATALOG_SEARCH_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.searchResults,
      }
    case catalogTypes.CATALOG_SEARCH_ERROR:
      return {
        ...state,
        isSearching: false,
        searchError: action.error,
      }
    case mapTypes.MAP_BBOX_CLEARED:
      return {
        ...state,
        searchResults: null,
        searchError: null,
      }
    default:
      return state
  }
}