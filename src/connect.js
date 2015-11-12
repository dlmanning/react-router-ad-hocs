import React from 'react'
import warning from 'warning'
import { PropTypes } from 'react-router'

export default function connect (...hocs) {
  let { wrappedComponentProps, ...Component } = hocs.reduce((accum, hoc) => {
    let {
      wrappedComponentProps = {},
      propTypes = {},
      contextTypes = {},
      childContextTypes = {},
      ...etc
    } = hoc

    Object.assign(wrappedComponentProps, accum.wrappedComponentProps)
    propTypes = mergeTypes(propTypes, accum.propTypes)
    contextTypes = mergeTypes(contextTypes, accum.contextTypes)
    childContextTypes = mergeTypes(childContextTypes, accum.childContextTypes)

    return {
      ...accum,
      wrappedComponentProps,
      propTypes,
      contextTypes,
      childContextTypes,
      ...etc
    }

  }, {})

  applyTypes(Component.childContextTypes, Component.propTypes, Component.contextTypes)

  wrappedComponentProps = Object.entries(wrappedComponentProps)
  console.log(wrappedComponentProps)

  const Connect = WrappedComponent => {
    Component.render = () => {
      wrappedComponentProps.reduce((accum, [key, value]))
      return React.createElement(WrappedComponent)
    }
    return React.createClass(Component)
  }

  console.log(Connect)
}

function applyTypes (...typeProps) {
  typeProps.forEach(typeProp => {
    Object.keys(typeProp).forEach(key => {
      typeProp[key]
        = (key === 'history') ? (typeProp[key].isRequired) 
          ? PropTypes.history.isRequired : PropTypes.history
        : (key === 'route') ? (typeProp[key].isRequired)
          ? PropTypes.route.isRequired : PropTypes.route
        : PropTypes.any
    })
  })
}

function mergeTypes(a = {}, b = {}) {
  const merged = { ...a }

  for (let key in b) {
    if (b.hasOwnProperty(key)) {
      if (a[key] == null || b[key].isRequired) {
        merged[key] = b[key]
      }
    }
  }

  return merged
}

export const History = {
  wrappedComponentProps: {
    history: () => this.context.history
  },

  contextTypes: { history: { isRequired: false } }
}

export const Lifecycle = {
  displayName: 'Lifecycle',

  wrappedComponentProps: {
    refs: () => instance => this.setupLifecyle(instance)
  },

  propTypes: {
    route: { isRequired: false }
  },

  contextTypes: {
    history: { isRequired: true },
    route: { isRequired: false } 
  },

  setupLifecyle (wrappedInstance) {
    if (wrappedInstance == null) {
      return
    }

    invariant(
      wrappedInstance.routerWillLeave,
      'The Lifecycle higher-order component requires you to define a routerWillLeave method'
    )

    const route = this.props.route || this.context.route

    invariant(
      route,
      'The Lifecycle higher-order component must be used on either a) a <Route component> ' +
      'or b) a descendant of a <Route component> that uses the RouteContext mixin'
    )

    this._unlistenBeforeLeavingRoute = this.context.history.listenBeforeLeavingRoute(
      route,
      wrappedInstance.routerWillLeave
    )
  },

  componentWillUnmount () {
    if (this._unlistenBeforeLeavingRoute) {
      this._unlistenBeforeLeavingRoute()
    }
  }

}

export const RouteContext = {
  propTypes: {
    route: { isRequired: true }
  },

  childContextTypes: {
    route: { isRequired: true }
  },

  getChildContext: () => ({ route: this.props.route })
}

