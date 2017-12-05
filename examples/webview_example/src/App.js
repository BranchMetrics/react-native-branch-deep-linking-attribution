import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import branch from 'react-native-branch'

import RootNavigator from './RootNavigator'

export default class App extends Component {
  _unsubscribeFromBranch = null

  componentDidMount() {
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error("Error from Branch: " + error)
        return
      }

      console.log("Branch params: " + JSON.stringify(params))

      if (!params['+clicked_branch_link']) return

      // Get title and url for route
      let title = params.$og_title
      let url = params.$canonical_url
      let image = params.$og_image_url

      // Now push the view for this URL
      RootNavigator.navigate('Article', {url: url, title: title, image: image})
    })
  }

  componentWillUnmount() {
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch()
      this._unsubscribeFromBranch = null
    }
  }

  render() {
    return (
      <RootNavigator />
    )
  }
}
