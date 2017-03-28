import React, { Component } from 'react'
import { Button, StyleSheet, View, WebView } from 'react-native'

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
      automaticallyListOnSpotlight: true, // ignored on Android
      canonicalUrl: this.props.url,
      title: this.props.title
    })
    this.buo.userCompletedAction(RegisterViewEvent)
    console.log("Created Branch Universal Object.")
  }

  componentWillUnmount() {
    if (!this.buo) return
    this.buo.release()
  }

  render() {
    return (
      <View
        style={styles.container} >
        <WebView
          source={{uri: this.props.url}} />
        <Button
          title="Share"
          onPress={() => this.onShare()} />
      </View>
    )
  }

  async onShare() {
    let { channel, completed, error } = await this.buo.showShareSheet({
      messageHeader: "The Planet " + this.props.title,
      messageBody: "Read about the planet " + this.props.title + "."
    }, {
      feature: "share",
      channel: "RNApp"
    }, {
      $desktop_url: this.props.url
    })

    if (error) {
      console.error("Error sharing via Branch: " + error)
      return
    }

    console.log("Share to " + channel + " completed: " + completed)
  }
}
