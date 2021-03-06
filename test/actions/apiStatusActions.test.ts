/*
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
 */

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import thunk from 'redux-thunk'
import configureStore, {MockStoreEnhanced} from 'redux-mock-store'
import * as sinon from 'sinon'
import {ApiStatus, ApiStatusActions} from '../../src/actions/apiStatusActions'
import {apiStatusInitialState} from '../../src/reducers/apiStatusReducer'
import {getClient} from '../../src/api/session'
import {SinonSpy} from 'sinon'
import {AppState, initialState} from '../../src/store'

const mockStore = configureStore([thunk])
let store: MockStoreEnhanced<AppState>

const mockAdapter = new MockAdapter(axios)
let clientSpies: {[key: string]: SinonSpy} = {
  get: sinon.spy(getClient(), 'get'),
}

describe('apiStatusActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    store = mockStore(initialState) as any
  })

  afterEach(() => {
    mockAdapter.reset()
    Object.keys(clientSpies).forEach(name => clientSpies[name].resetHistory())
  })

  afterAll(() => {
    mockAdapter.restore()
    Object.keys(clientSpies).forEach(name => clientSpies[name].restore())
  })

  describe('fetch()', () => {
    test('success', async () => {
      const mockResponse = {
        geoserver: 'a',
        'enabled-platforms': ['a', 'b'],
      }
      mockAdapter.onGet('/').reply(200, mockResponse)

      await store.dispatch(ApiStatus.fetch() as any)

      expect(clientSpies.get.callCount).toEqual(1)
      expect(clientSpies.get.args[0]).toEqual(['/'])

      expect(store.getActions()).toEqual([
        { type: ApiStatusActions.Fetching.type },
        {
          type: ApiStatusActions.FetchSuccess.type,
          payload: {
            geoserver: {
              wmsUrl: mockResponse.geoserver + '/wms',
            },
            enabledPlatforms: mockResponse['enabled-platforms'],
          },
        },
      ])
    })

    test('request error', async () => {
      mockAdapter.onGet('/').reply(400)

      await store.dispatch(ApiStatus.fetch() as any)

      const actions = store.getActions()
      expect(actions.length).toEqual(2)
      expect(actions[0]).toEqual({ type: ApiStatusActions.Fetching.type })
      expect(actions[1].type).toEqual(ApiStatusActions.FetchError.type)
      expect(actions[1].payload).toHaveProperty('error')
    })

    test('invalid response data', async () => {
      mockAdapter.onGet('/').reply(200)

      await store.dispatch(ApiStatus.fetch() as any)

      const actions = store.getActions()
      expect(actions.length).toEqual(2)
      expect(actions[0]).toEqual({ type: ApiStatusActions.Fetching.type })
      expect(actions[1].type).toEqual(ApiStatusActions.FetchError.type)
      expect(actions[1].payload).toHaveProperty('error')
    })
  })

  describe('serialize()', () => {
    test('success', async () => {
      await store.dispatch(ApiStatus.serialize() as any)

      const state = store.getState()

      expect(sessionStorage.setItem).toHaveBeenCalledTimes(2)
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'geoserver',
        JSON.stringify(state.apiStatus.geoserver),
      )
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'enabled_platforms_records',
        JSON.stringify(state.apiStatus.enabledPlatforms),
      )

      expect(store.getActions()).toEqual([
        { type: ApiStatusActions.Serialized.type },
      ])
    })
  })

  describe('deserialize()', () => {
    test('success', async () => {
      // Mock local storage.
      const mockStorage = {
        geoserver: 'a',
        enabled_platforms_records: ['a', 'b'],
      }
      sessionStorage.setItem('geoserver', JSON.stringify(mockStorage.geoserver))
      sessionStorage.setItem('enabled_platforms_records', JSON.stringify(mockStorage.enabled_platforms_records))

      await store.dispatch(ApiStatus.deserialize())

      expect(sessionStorage.getItem).toHaveBeenCalledTimes(2)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('geoserver')
      expect(sessionStorage.getItem).toHaveBeenCalledWith('enabled_platforms_records')

      expect(store.getActions()).toEqual([
        {
          type: ApiStatusActions.Deserialized.type,
          payload: {
            geoserver: mockStorage.geoserver,
            enabledPlatforms: mockStorage.enabled_platforms_records,
          },
        },
      ])
    })

    test('no saved data', async () => {
      await store.dispatch(ApiStatus.deserialize())

      expect(sessionStorage.getItem).toHaveBeenCalledTimes(2)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('geoserver')
      expect(sessionStorage.getItem).toHaveBeenCalledWith('enabled_platforms_records')

      expect(store.getActions()).toEqual([
        {
          type: ApiStatusActions.Deserialized.type,
          payload: {
            geoserver: apiStatusInitialState.geoserver,
            enabledPlatforms: apiStatusInitialState.enabledPlatforms,
          },
        },
      ])
    })

    test('invalid saved data', async () => {
      // Mock local storage.
      sessionStorage.setItem('geoserver', 'badJson')
      sessionStorage.setItem('enabled_platforms_records', 'badJson')

      await store.dispatch(ApiStatus.deserialize())

      // Deserialize should gracefully handle errors.
      expect(sessionStorage.getItem).toHaveBeenCalledTimes(2)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('geoserver')
      expect(sessionStorage.getItem).toHaveBeenCalledWith('enabled_platforms_records')

      expect(store.getActions()).toEqual([
        {
          type: ApiStatusActions.Deserialized.type,
          payload: {
            enabledPlatforms: apiStatusInitialState.enabledPlatforms,
            geoserver: apiStatusInitialState.geoserver,
          },
        },
      ])
    })
  })
})
