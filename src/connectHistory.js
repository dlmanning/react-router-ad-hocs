import React, { Component } from 'react'
import warning from 'warning'
import { PropTypes } from 'react-router'

/**
 * A higher-order-component that passes "history" as a property to components.
 */

function connectHistory(WrappedComponent) {
  class ConnectHistory extends Component {
    render() {
      warning(
        !(this.props.history != null && this.props.history !== this.context.history),
        'The passed prop "history" will be overwritten by connectHistory()'
      )
      return <WrappedComponent {...this.props} history={this.context.history} />
    }
  }

  ConnectHistory.contextTypes = { history: PropTypes.history }
  ConnectHistory.displayName = `ConnectHistory(${getDisplayName(WrappedComponent)})`
  ConnectHistory.WrappedComponent = WrappedComponent

  return ConnectHistory
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default connectHistory
