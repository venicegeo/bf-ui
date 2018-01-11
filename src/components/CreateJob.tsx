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

const styles: any = require('./CreateJob.css')
const DATE_FORMAT = 'YYYY-MM-DD'

import * as React from 'react'
import * as moment from 'moment'
import {AlgorithmList} from './AlgorithmList'
import {ImagerySearch} from './ImagerySearch'
import {ImagerySearchList} from './ImagerySearchList'
import {NewJobDetails} from './NewJobDetails'
import {PrimaryMap} from './PrimaryMap'
import {createJob} from '../api/jobs'
import {SOURCE_RAPIDEYE} from '../constants'

export interface SearchCriteria {
  cloudCover: number
  dateFrom: string
  dateTo: string
  source: string
}

interface Props {
  algorithms: beachfront.Algorithm[]
  bbox: number[]
  catalogApiKey: string
  hoverSceneIds: string[]
  imagery: beachfront.ImageryCatalogPage
  isSearching: boolean
  map: PrimaryMap
  searchError: any
  searchCriteria: SearchCriteria
  selectedScene: beachfront.Scene
  onCatalogApiKeyChange(apiKey: string)
  onClearBbox()
  onHoverScenes(scenes: beachfront.Scene[])
  onJobCreated(job: beachfront.Job)
  onSearchCriteriaChange(criteria: SearchCriteria)
  onSearchSubmit()
  onSelectFeature(feature: any) // (feature: beachfront.Job | beachfront.Scene)
}

interface State {
  isCreating?: boolean
  computeMask?: boolean
  name?: string
  shouldAutogenerateName?: boolean
  algorithmError?: any
}

export const createSearchCriteria = (): SearchCriteria => ({
  cloudCover: 10,
  dateFrom:   moment.utc().subtract(30, 'days').format(DATE_FORMAT),
  dateTo:     moment.utc().format(DATE_FORMAT),
  source:     SOURCE_RAPIDEYE,
})

export class CreateJob extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isCreating: false,
      computeMask: false,
      name: props.selectedScene ? generateName(props.selectedScene.id) : '',
      shouldAutogenerateName: true,
      algorithmError: '',
    }
    this.handleCreateJob = this.handleCreateJob.bind(this)
    this.handleComputeMaskChange = this.handleComputeMaskChange.bind(this)
    this.handleListClick = this.handleListClick.bind(this)
    this.handleListMouseEnter = this.handleListMouseEnter.bind(this)
    this.handleListMouseLeave = this.handleListMouseLeave.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSearchCloudCoverChange = this.handleSearchCloudCoverChange.bind(this)
    this.handleSearchDateChange = this.handleSearchDateChange.bind(this)
    this.handleSearchSourceChange = this.handleSearchSourceChange.bind(this)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.shouldAutogenerateName && nextProps.selectedScene && nextProps.selectedScene !== this.props.selectedScene) {
      this.setState({ name: generateName(nextProps.selectedScene.id) })
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <header>
          <h1>Create Job</h1>
        </header>
        <ul>
          {this.props.bbox && (
            <li className={styles.search}>
              <ImagerySearch
                bbox={this.props.bbox}
                catalogApiKey={this.props.catalogApiKey}
                cloudCover={this.props.searchCriteria.cloudCover}
                dateFrom={this.props.searchCriteria.dateFrom}
                dateTo={this.props.searchCriteria.dateTo}
                error={this.props.searchError}
                isSearching={this.props.isSearching}
                source={this.props.searchCriteria.source}
                onApiKeyChange={this.props.onCatalogApiKeyChange}
                onClearBbox={this.props.onClearBbox}
                onCloudCoverChange={this.handleSearchCloudCoverChange}
                onDateChange={this.handleSearchDateChange}
                onSourceChange={this.handleSearchSourceChange}
                onSubmit={this.props.onSearchSubmit}
              />
            </li>
          )}

          {this.props.bbox && this.props.imagery && this.props.map && (
            <ImagerySearchList
              imagery={this.props.imagery}
              hoverSceneIds={this.props.hoverSceneIds}
              selectedScene={this.props.selectedScene}
              onClick={this.handleListClick}
              onMouseEnter={this.handleListMouseEnter}
              onMouseLeave={this.handleListMouseLeave}
            />
          )}

          {this.props.bbox && this.props.selectedScene && (
            <li className={styles.details}>
              <NewJobDetails
                computeMask={this.state.computeMask}
                name={this.state.name}
                onComputeMaskChange={this.handleComputeMaskChange}
                onNameChange={this.handleNameChange}
              />
            </li>
          )}

          {this.props.bbox && this.props.selectedScene && (
            <li className={styles.algorithms}>
              <AlgorithmList
                algorithms={this.props.algorithms}
                sceneMetadata={this.props.selectedScene.properties}
                isSubmitting={this.state.isCreating}
                error={this.state.algorithmError}
                onSubmit={this.handleCreateJob}
              />
            </li>
          )}

          {!this.props.bbox && (
            <li className={styles.placeholder}>
              <h3>Draw bounding box to search for imagery</h3>
            </li>
          )}
        </ul>
      </div>
    )
  }

  private handleListClick(feature: beachfront.Scene) {
    this.props.map.handleSelectFeature(feature.id)
  }

  private handleListMouseEnter(feature: beachfront.Scene) {
    this.props.onHoverScenes(null)
    this.props.map.handleHoverScene(feature.id)
  }

  private handleListMouseLeave(_: beachfront.Scene) {
    this.props.map.handleHoverScene(null)
    this.props.onHoverScenes(null)
  }

  private handleCreateJob(algorithm) {
    this.setState({ isCreating: true })
    createJob({
      algorithmId: algorithm.id,
      computeMask: this.state.computeMask,
      name:        this.state.name,
      sceneId:     this.props.selectedScene.id,
      catalogApiKey: this.props.catalogApiKey,
    })
      .then(job => {
        this.setState({ isCreating: false })
        // Reset Search Criteria
        this.props.onSearchCriteriaChange(createSearchCriteria())

        // Release the job
        this.props.onJobCreated(job)
      })
        .catch(algorithmError => {
            this.setState({ algorithmError, isCreating: false })
        })
  }

  private handleSearchCloudCoverChange(cloudCover) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      cloudCover: parseInt(cloudCover, 10),
    }))
  }

  private handleSearchDateChange(dateFrom, dateTo) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      dateFrom,
      dateTo,
    }))
  }

  private handleSearchSourceChange(source: string) {
    this.props.onSearchCriteriaChange({ ...this.props.searchCriteria, source })
  }

  private handleComputeMaskChange(computeMask: boolean) {
    this.setState({ computeMask })
  }

  private handleNameChange(name) {
    this.setState({
      name,
      shouldAutogenerateName: !name,
    })
  }
}

//
// Helpers
//

function generateName(sceneId): string {
  return sceneId.replace(/^(rapideye|planetscope|landsat|sentinel):/, '')
}
