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

import * as React from 'react'
import {connect} from 'react-redux'
import AlgorithmList from './AlgorithmList'
import ImagerySearch from './ImagerySearch'
import ImagerySearchList from './ImagerySearchList'
import {NewJobDetails} from './NewJobDetails'
import {PrimaryMap} from './PrimaryMap'
import {normalizeSceneId} from './SceneFeatureDetails'
import {TYPE_SCENE} from '../constants'
import {AppState} from '../store'
import {Jobs, JobsCreateJobArgs} from '../actions/jobsActions'

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>
type PassedProps = {
  mapRef: PrimaryMap
}
type Props = StateProps & DispatchProps & PassedProps

interface State {
  computeMask: boolean
  name: string
  selectedScene: beachfront.Scene | null
}

export class CreateJob extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      computeMask: true,
      name: '',
      selectedScene: null,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleComputeMaskChange = this.handleComputeMaskChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.map.selectedFeature !== this.props.map.selectedFeature) {
      let selectedScene: beachfront.Scene | null = null
      const selectedFeature = this.props.map.selectedFeature
      if (selectedFeature && selectedFeature.properties && selectedFeature.properties.type === TYPE_SCENE) {
        selectedScene = selectedFeature as beachfront.Scene
      }

      if (selectedScene !== this.state.selectedScene) {
        // Set the default name using the scene id.
        if (selectedScene) {
          this.setState({ name: normalizeSceneId(selectedScene.id) || '' })
        }

        // Reset the algorithm error.
        if (this.props.jobs.createJobError) {
          this.props.dispatch.jobs.dismissCreateJobError()
        }
      }

      this.setState({ selectedScene })
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <header>
          <h1>Create Job</h1>
        </header>
        <ul>
          {this.props.map.bbox && (
            <li className={styles.search}>
              <ImagerySearch />
            </li>
          )}

          {this.props.map.bbox && this.props.catalog.searchResults && this.props.mapRef && (
            <li className={styles.results}>
              <ImagerySearchList />
            </li>
          )}

          {this.props.map.bbox && this.state.selectedScene && (
            <li className={styles.details}>
              <NewJobDetails
                computeMask={this.state.computeMask}
                name={this.state.name}
                onComputeMaskChange={this.handleComputeMaskChange}
                onNameChange={this.handleNameChange}
              />
            </li>
          )}

          {this.props.map.bbox && this.state.selectedScene && (
            <li className={styles.algorithms}>
              <AlgorithmList
                sceneMetadata={this.state.selectedScene.properties}
                onSubmit={this.handleSubmit}
              />
            </li>
          )}

          {!this.props.map.bbox && (
            <li className={styles.placeholder}>
              <h3>Draw a bounding box to search for imagery</h3>
              <h4>Click once to begin drawing the box, and click again to complete it</h4>
            </li>
          )}
        </ul>
      </div>
    )
  }

  private handleSubmit(algorithm: beachfront.Algorithm) {
    if (!this.state.selectedScene) {
      throw new Error('Unable to submit: selectedScene is null!')
    }

    this.props.dispatch.jobs.createJob({
      algorithmId: algorithm.id,
      computeMask: this.state.computeMask,
      name: this.state.name,
      sceneId: this.state.selectedScene.id,
      catalogApiKey: this.props.catalog.apiKey,
    })
  }

  private handleComputeMaskChange(computeMask: boolean) {
    this.setState({ computeMask })
  }

  private handleNameChange(name: string) {
    this.setState({ name })
  }
}

function mapStateToProps(state: AppState) {
  return {
    catalog: state.catalog,
    map: state.map,
    jobs: state.jobs,
  }
}

function mapDispatchToProps(dispatch: Function) {
  return {
    dispatch: {
      jobs: {
        createJob: (args: JobsCreateJobArgs) => dispatch(Jobs.createJob(args)),
        dismissCreateJobError: () => dispatch(Jobs.dismissCreateJobError()),
      },
    },
  }
}

export default connect<StateProps, DispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateJob)
