import React, { Component } from 'react'
import { StyleSheet, WebView } from 'react-native'

import branch, { RegisterViewEvent } from 'react-native-branch'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
})

export default class Article extends Component {
  buo = null

  async componentWillMount() {
    this.buo = await branch.createBranchUniversalObject("planet:" + this.props.title, {
      canonicalUrl: this.props.url,
      title: this.props.title
    })
    this.buo.userCompletedAction(RegisterViewEvent)
    console.log("Created Branch Universal Object: " + this.buo)
  }

  componentWillUnmount() {
    if (!this.buo) return
    this.buo.release()
  }

  render() {
    return (
      <WebView
        style={styles.container}
        source={{uri: this.props.url}} />
      )
  }
}
