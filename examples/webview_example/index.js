/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import App from './src/App'

export default class webview_example extends Component {
  render() {
    return <App />
  }
}

AppRegistry.registerComponent('webview_example', () => webview_example);
