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
import {shallow} from 'enzyme'
import {assert} from 'chai'
import * as sinon from 'sinon'
import {Algorithm} from '../../app/components/Algorithm'

describe('<Algorithm/>', () => {
  let _props

  beforeEach(() => {
    _props = {
      algorithm: {
        description:  'test-description',
        name:         'test-name',
        requirements: [
          {
            name: 'Bands',
            description: 'test-description',
            literal: 'red,green',
          },
        ],
      },
      imageProperties: {
        bands:      {},
        cloudCover: 5,
      },
      isSelected:   false,
      isSubmitting: false,
      onSelect:     sinon.stub(),
      onSubmit:     sinon.stub(),
    }
  })

  it('renders', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
      />
    )
    assert.equal(wrapper.find('.Algorithm-name').text(), 'test-name')
    assert.equal(wrapper.find('.Algorithm-description').text(), 'test-description')
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr th').text(), 'Bands')
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr td').text(), 'test-description')
  })

  it('can be neither selectable nor submittable', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
      />
    )
    assert.equal(wrapper.find('.Algorithm-selectionIndicator').length, 0)
    assert.equal(wrapper.find('.Algorithm-startButton').length, 0)
  })

  it('can be selectable', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        onSelect={_props.onSelect}
      />
    )
    assert.equal(wrapper.find('.Algorithm-selectionIndicator').length, 1)
  })

  it('can be submittable', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        onSubmit={_props.onSubmit}
      />
    )
    assert.equal(wrapper.find('.Algorithm-startButton').length, 1)
  })

  it('can be selectable AND submittable', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        onSelect={_props.onSelect}
        onSubmit={_props.onSubmit}
      />
    )
    assert.equal(wrapper.find('.Algorithm-selectionIndicator').length, 1)
    assert.equal(wrapper.find('.Algorithm-startButton').length, 1)
  })

  it('prevents new submissions while submission in flight', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        isSubmitting={true}
        onSubmit={_props.onSubmit}
      />
    )
    assert.isTrue(wrapper.find('.Algorithm-startButton').prop('disabled'))
  })

  it('shows as `selected` appropriately', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        isSelected={true}
        onSelect={_props.onSelect}
      />
    )
    assert.isTrue(wrapper.find('.Algorithm-selectionIndicator input').prop('checked'))
  })

  it('emits `onSelect` event', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        isSelected={_props.isSelected}
        onSelect={_props.onSelect}
      />
    )
    wrapper.find('.Algorithm-header').simulate('click')
    assert.isTrue(_props.onSelect.called)
  })

  it('does not emit `onSelect` event if already selected', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        isSelected={true}
        onSelect={_props.onSelect}
      />
    )
    wrapper.find('.Algorithm-header').simulate('click')
    assert.isTrue(_props.onSelect.notCalled)
  })

  it('does not emit `onSelect` event if not selectable', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
      />
    )
    wrapper.find('.Algorithm-header').simulate('click')
    assert.isTrue(_props.onSelect.notCalled)
  })

  it('emits `onSubmit` event', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        onSubmit={_props.onSubmit}
      />
    )
    wrapper.find('.Algorithm-startButton').simulate('click')
    assert.isTrue(_props.onSubmit.called)
  })

  it('verifies image compatibility (meets all requirements)', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={{
          id:           'test-id',
          description:  'test-description',
          name:         'test-name',
          requirements: [
            {
              name: 'Bands',
              description: 'test-description',
              literal: 'red,green',
            },
            {
              name: 'Cloud Cover',
              description: 'test-description',
              literal: '10',
            },
          ],
          type: 'test-type',
          url: 'test-url',
        }}
        imageProperties={{
          bands: {
            red: 'lorem',
            green: 'lorem',
          },
          cloudCover: 5,
        } as any}
      />
    )
    assert.equal(wrapper.find('.Algorithm-root').hasClass('Algorithm-isCompatible'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(0).hasClass('Algorithm-met'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(1).hasClass('Algorithm-met'), true)
  })

  it('verifies image compatibility (meets some requirements)', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={{
          id:           'test-id',
          description:  'test-description',
          name:         'test-name',
          requirements: [
            {
              name: 'Bands',
              description: 'test-description',
              literal: 'red,green',
            },
            {
              name: 'Cloud Cover',
              description: 'test-description',
              literal: '9000',
            },
          ],
          type: 'test-type',
          url: 'test-url',
        }}
        imageProperties={{
          bands: {
            red: 'lorem',
            green: 'lorem',
          },
          cloudCover: 9001,
        } as any}
      />
    )
    assert.equal(wrapper.find('.Algorithm-root').hasClass('Algorithm-isNotCompatible'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(0).hasClass('Algorithm-met'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(1).hasClass('Algorithm-unmet'), true)
  })

  it('verifies image compatibility (meets no requirements)', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={{
          id:           'test-id',
          description:  'test-description',
          name:         'test-name',
          requirements: [
            {
              name: 'Bands',
              description: 'test-description',
              literal: 'red,green',
            },
            {
              name: 'Cloud Cover',
              description: 'test-description',
              literal: '9000',
            },
          ],
          type: 'test-type',
          url: 'test-url',
        }}
        imageProperties={{
          bands: {
            hotpink: 'lorem',
            fuschia: 'lorem',
          },
          cloudCover: 9001,
        } as any}
      />
    )
    assert.equal(wrapper.find('.Algorithm-root').hasClass('Algorithm-isNotCompatible'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(0).hasClass('Algorithm-unmet'), true)
    assert.equal(wrapper.find('.Algorithm-requirements tbody tr').at(1).hasClass('Algorithm-unmet'), true)
  })

  it('supports custom compatibility warnings', () => {
    const wrapper = shallow(
      <Algorithm
        algorithm={_props.algorithm}
        imageProperties={_props.imageProperties}
        warningHeading="test-warning-heading"
        warningMessage="test-warning-message"
        isSubmitting={true}
        onSubmit={_props.onSubmit}
      />
    )
    assert.equal(wrapper.find('.Algorithm-compatibilityWarning h4').text().trim(), 'test-warning-heading')
    assert.equal(wrapper.find('.Algorithm-compatibilityWarning p').text().trim(), 'test-warning-message')
  })
})
