import React, {Component} from 'react'
import moment from 'moment'
import StaticMinimap from './StaticMinimap'
import styles from './ImagerySearch.css'

const KEY_CATALOG_API_KEY = 'catalogApiKey'

export default class ImagerySearch extends Component {
  static propTypes = {
    bbox: React.PropTypes.array,
    error: React.PropTypes.object,
    isSearching: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  }

  constructor() {
    super()
    this._emitOnChange = this._emitOnChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount() {
    this.refs.dateFrom.value = moment().subtract(5, 'days').format('YYYY-MM-DD')
    this.refs.dateTo.value = moment().format('YYYY-MM-DD')
    this.refs.apiKey.value = localStorage.getItem(KEY_CATALOG_API_KEY) || ''
    this._emitOnChange()
  }

  render() {
    const {error, bbox, isSearching} = this.props
    return (
      <form className={`${styles.root} ${isSearching ? styles.isSearching : ''}`} onSubmit={this._handleSubmit}>
        <h2>Search for Imagery</h2>
        <div className={styles.minimap}>
          <StaticMinimap bbox={bbox}/>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <h4><i className="fa fa-warning"/> Search failed</h4>
            <p>Could not search the image catalog because of an error.</p>
            <pre>{error.stack}</pre>
          </div>
        )}
        <h3>Catalog</h3>
        <label className={styles.field}>
          <span>Provider</span>
          <select disabled={true}>
            <option>Planet Labs (LANDSAT)</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>API Key</span>
          <input ref="apiKey" type="password" disabled={isSearching} onChange={this._emitOnChange} />
        </label>

        <h3>Date/Time</h3>
        <label className={styles.field}>
          <span>From</span>
          <input ref="dateFrom" type="date" disabled={isSearching} onChange={this._emitOnChange} />
        </label>
        <label className={styles.field}>
          <span>To</span>
          <input ref="dateTo" type="date" disabled={true} />
        </label>

        <div className={styles.controls}>
          <button disabled={isSearching}>Search for imagery</button>
        </div>
      </form>
    )
  }

  //
  // Internals
  //

  _emitOnChange() {
    const {apiKey, dateFrom, dateTo} = this.refs
    localStorage.setItem(KEY_CATALOG_API_KEY, apiKey.value)
    console.debug('_emitOnChange', apiKey.value, dateFrom.value, dateTo.value)
    this.props.onChange(apiKey.value, dateFrom.value, dateTo.value)
  }

  _handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onSubmit()
  }
}