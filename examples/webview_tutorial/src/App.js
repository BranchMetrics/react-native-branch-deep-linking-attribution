import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

// Step 1: import branch

import RootNavigator from './RootNavigator'

export default class App extends Component {
  // Step 2: Add _unsubscribeFromBranch property

  // Step 3: Add componentDidMount

  // Step 4: Add componentWillUnmount

  render() {
    return (
      <RootNavigator />
    )
  }
}
