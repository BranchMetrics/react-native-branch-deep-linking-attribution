/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import Article from './src/Article'

export default class webview_example_native_ios extends Component {
  render() {
    return <Article route={this.props.route}/>
  }
}

AppRegistry.registerComponent('webview_example_native_ios', () => webview_example_native_ios);
