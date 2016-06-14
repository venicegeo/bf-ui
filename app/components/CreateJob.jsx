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

import React, {Component} from 'react'
import {connect} from 'react-redux'
import AlgorithmList from './AlgorithmList'
import ImagerySearch from './ImagerySearch'
import NewJobDetails from './NewJobDetails'
import {deserialize} from '../utils/bbox'
import {createJob, searchImageCatalog, updateImageryCatalogApiKey, updateImageSearchCriteria} from '../actions'
import styles from './CreateJob.css'

function selector(state) {
  return {
    algorithms: state.algorithms.records,
    catalogApiKey: state.imagery.catalogApiKey,
    isSearching: state.imagery.search.searching,
    searchCriteria: state.imagery.search.criteria,
    error: state.imagery.search.error,
    selectedImage: state.imagery.selection
  }
}

class CreateJob extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    algorithms: React.PropTypes.array.isRequired,
    catalogApiKey: React.PropTypes.string,
    dispatch: React.PropTypes.func.isRequired,
    isSearching: React.PropTypes.bool.isRequired,
    searchCriteria: React.PropTypes.object,
    error: React.PropTypes.object,
    selectedImage: React.PropTypes.object,
    location: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {name: null}
    this._handleJobSubmit = this._handleJobSubmit.bind(this)
    this._handleNameChange = this._handleNameChange.bind(this)
    this._handleImageryCatalogApiKeyChange = this._handleImageryCatalogApiKeyChange.bind(this)
    this._handleClearBbox = this._handleClearBbox.bind(this)
    this._handleSearchSubmit = this._handleSearchSubmit.bind(this)
    this._handleSearchCriteriaChange = this._handleSearchCriteriaChange.bind(this)
  }

  render() {
    const bbox = deserialize(this.props.params.bbox)
    return (
      <div className={styles.root}>
        <header>
          <h1>Create Job</h1>
        </header>
        <ul>
          {bbox && (
            <li className={styles.imagery}>
              <ImagerySearch bbox={bbox}
                             catalogApiKey={this.props.catalogApiKey}
                             dateFrom={this.props.searchCriteria.dateFrom}
                             dateTo={this.props.searchCriteria.dateTo}
                             error={this.props.error}
                             isSearching={this.props.isSearching}
                             onApiKeyChange={this._handleImageryCatalogApiKeyChange}
                             onCriteriaChange={this._handleSearchCriteriaChange}
                             onClearBbox={this._handleClearBbox}
                             onSubmit={this._handleSearchSubmit}/>
            </li>
          )}
          {bbox && this.props.selectedImage && (
            <li className={styles.details}>
              <NewJobDetails onNameChange={this._handleNameChange}/>
            </li>
          )}
          {bbox && this.props.selectedImage && (
            <li className={styles.algorithms}>
              <AlgorithmList algorithms={this.props.algorithms}
                             imageProperties={this.props.selectedImage.properties}
                             onSubmit={this._handleJobSubmit}/>
            </li>
          )}

          {!bbox && (
            <li className={styles.placeholder}>
              <h3>Draw bounding box to search for imagery</h3>
              <p>or</p>
              <button className={styles.uploadButton}>
                <i className="fa fa-upload"/> Upload my own image
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  }

  //
  // Internals
  //

  _handleClearBbox() {
    this.context.router.push({...this.props.location, pathname: '/create-job'})
  }

  _handleJobSubmit(algorithm) {
    const {selectedImage, catalogApiKey} = this.props
    const {name} = this.state
    this.props.dispatch(createJob(catalogApiKey, name, algorithm, selectedImage))
      .then(jobId => {
        this.context.router.push({
          pathname: '/jobs',
          query: {
            jobId
          }
        })
      })
  }

  _handleNameChange(name) {
    this.setState({name})
  }

  _handleImageryCatalogApiKeyChange(apiKey) {
    this.props.dispatch(updateImageryCatalogApiKey(apiKey))
  }

  _handleSearchCriteriaChange(dateFrom, dateTo) {
    this.props.dispatch(updateImageSearchCriteria(this.props.params.bbox, dateFrom, dateTo))
  }

  _handleSearchSubmit() {
    this.props.dispatch(searchImageCatalog())
  }
}

export default connect(selector)(CreateJob)
