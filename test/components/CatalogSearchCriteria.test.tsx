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

import * as React from 'react'
import * as sinon from 'sinon'
import {shallow} from 'enzyme'
import {assert} from 'chai'
import {CatalogSearchCriteria} from '../../app/components/CatalogSearchCriteria'

describe('<CatalogSearchCriteria/>', () => {
  let _props

  beforeEach(() => {
    _props = {
      bbox:               [0, 0, 0, 0],
      apiKey:             'test-catalog-api-key',
      cloudCover:         19,
      dateFrom:           '2016-01-01',
      dateTo:             '2016-02-01',
      filter:             '',
      filters:            [],
      onApiKeyChange:     sinon.stub(),
      onClearBbox:        sinon.stub(),
      onCloudCoverChange: sinon.stub(),
      onDateChange:       sinon.stub(),
      onFilterChange:     sinon.stub(),
    }
  })

  it('renders', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    assert.equal(wrapper.find('.CatalogSearchCriteria-apiKey input').prop('value'), 'test-catalog-api-key')
    assert.equal(wrapper.find('.CatalogSearchCriteria-cloudCover input').prop('value'), '19')
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateFrom input').prop('value'), '2016-01-01')
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateTo input').prop('value'), '2016-02-01')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter select').prop('value'), '')
  })

  it('does not render date fields if `dateFrom` and `dateTo` are undefined', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={undefined}
        dateTo={undefined}
        filter={'test-id'}
        filters={[
          {id: 'test-id', name: 'Testing'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateFrom input').length, 0)
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateTo input').length, 0)
  })

  it('renders error message if exists')

  it('renders spatial filter options', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={'test-id'}
        filters={[
          {id: 'test-id', name: 'Testing'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter select').prop('value'), 'test-id')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(0).prop('value'), '')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(0).text(), 'None')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(1).prop('value'), 'test-id')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(1).text(), 'Testing')
  })

  it('normalizes spatial filter names', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={[
          {id: 'test-filter-1', name: 'lorem ipsum'},
          {id: 'test-filter-2', name: 'dolor sit amet'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(1).text(), 'Lorem Ipsum')
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter option').at(2).text(), 'Dolor Sit Amet')
  })

  it('renders with correct initial spatial filter selection', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={'test-filter-1'}
        filters={[
          {id: 'test-filter-1', name: 'test-name'},
          {id: 'test-filter-2', name: 'dolor sit amet'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter select').prop('value'), 'test-filter-1')
  })

  it('emits api key change event', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-apiKey input').simulate('change', {target: {value: 'test-new-catalog-api-key'}})
    assert.isTrue(_props.onApiKeyChange.calledWithExactly('test-new-catalog-api-key'))
  })

  it('emits bbox clear event', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-clearBbox').simulate('click')
    assert.equal(_props.onClearBbox.callCount, 1)
  })

  it('emits cloud cover change event', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-cloudCover input').simulate('change', {target: {value: '42'}})
    assert.isTrue(_props.onCloudCoverChange.calledWithExactly(42))
  })

  it('emits date change event (via "from" date)', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-captureDateFrom input').simulate('change', {target: {value: '1999-12-31'}})
    assert.isTrue(_props.onDateChange.calledWithExactly('1999-12-31', _props.dateTo))
  })

  it('emits date change event (via "to" date)', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-captureDateTo input').simulate('change', {target: {value: '1999-12-31'}})
    assert.isTrue(_props.onDateChange.calledWithExactly(_props.dateFrom, '1999-12-31'))
  })

  it('emits spatial filter change event', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={''}
        filters={[
          {id: 'test-id', name: 'Testing'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-spatialFilter select').simulate('change', {target: {value: 'test-id'}})
    assert.isTrue(_props.onFilterChange.calledWithExactly('test-id'))
  })

  it('emits spatial filter change event (to empty)', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={'test-id'}
        filters={[
          {id: 'test-id', name: 'Testing'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.find('.CatalogSearchCriteria-spatialFilter select').simulate('change', {target: {value: ''}})
    assert.isTrue(_props.onFilterChange.calledWithExactly(null))
  })

  it('updates api key when props change', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.setProps({apiKey: 'test-new-catalog-api-key'})
    assert.equal(wrapper.find('.CatalogSearchCriteria-apiKey input').prop('value'), 'test-new-catalog-api-key')
  })

  it('updates cloud cover when props change', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.setProps({cloudCover: 42})
    assert.equal(wrapper.find('.CatalogSearchCriteria-cloudCover input').prop('value'), '42')
  })

  it('updates date when props change (via "from" date)', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.setProps({dateFrom: '1999-12-31'})
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateFrom input').prop('value'), '1999-12-31')
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateTo input').prop('value'), _props.dateTo)
  })

  it('updates date when props change (via "to" date)', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={_props.filter}
        filters={_props.filters}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.setProps({dateTo: '1999-12-31'})
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateFrom input').prop('value'), _props.dateFrom)
    assert.equal(wrapper.find('.CatalogSearchCriteria-captureDateTo input').prop('value'), '1999-12-31')
  })

  it('updates spatial filter when props change', () => {
    const wrapper = shallow(
      <CatalogSearchCriteria
        bbox={_props.bbox}
        apiKey={_props.apiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        filter={''}
        filters={[
          {id: 'test-id', name: 'Testing'},
        ]}
        onApiKeyChange={_props.onApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onCloudCoverChange={_props.onCloudCoverChange}
        onDateChange={_props.onDateChange}
        onFilterChange={_props.onFilterChange}
      />
    )
    wrapper.setProps({filter: 'test-id'})
    assert.equal(wrapper.find('.CatalogSearchCriteria-spatialFilter select').prop('value'), 'test-id')
  })
})
