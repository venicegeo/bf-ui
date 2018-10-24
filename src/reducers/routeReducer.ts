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

import {types} from '../actions/routeActions'
import {generateRoute} from '../utils/routeUtils'

export interface RouteState {
  hash: string
  href: string
  jobIds: string[]
  pathname: string
  search: string
  selectedFeature: GeoJSON.Feature<any> | null
}

export const routeInitialState: RouteState = generateRoute(location)

export function routeReducer(state = routeInitialState, action: any): RouteState {
  switch (action.type) {
    case types.ROUTE_CHANGED:
      return {
        ...state,
        ...action.route,
      }
    default:
      return state
  }
}
