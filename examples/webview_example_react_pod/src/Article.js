import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, WebView } from 'react-native'

import branch, { BranchEvent } from 'react-native-branch'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 0
  },
  webView: {
  },
  button: {
    backgroundColor: '#cceeee',
    borderColor: '#2266aa',
    borderTopWidth: 1,
    flex: 0.15,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#2266aa',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default class Article extends Component {
  buo = null

  async componentDidMount() {
    this.buo = await branch.createBranchUniversalObject("planet/" + this.props.navigation.state.params.title, {
      locallyIndex: true,
      canonicalUrl: this.props.navigation.state.params.url,
      title: this.props.navigation.state.params.title,
      contentImageUrl: this.props.navigation.state.params.image
    })
    this.buo.logEvent(BranchEvent.ViewItem)
    console.log("Created Branch Universal Object and logged standard view item event.")
  }

  componentWillUnmount() {
    if (!this.buo) return
    this.buo.release()
    this.buo = null
  }

  render() {
    return (
      <View
        style={styles.container} >
        <WebView
          style={styles.webView}
          source={{uri: this.props.navigation.state.params.url}} />
        <TouchableHighlight
          onPress={() => this.onShare()}
          style={styles.button} >
          <Text
            style={styles.buttonText}>
            Share
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  async onShare() {
    let { channel, completed, error } = await this.buo.showShareSheet({
      emailSubject: "The Planet " + this.props.navigation.state.params.title,
      messageBody: "Read about the planet " + this.props.navigation.state.params.title + ".",
      messageHeader: "The Planet " + this.props.navigation.state.params.title
    }, {
      feature: "share",
      channel: "RNApp"
    }, {
      $desktop_url: this.props.navigation.state.params.url,
      $ios_deepview: "branch_default"
    })

    if (error) {
      console.error("Error sharing via Branch: " + error)
      return
    }

    console.log("Share to " + channel + " completed: " + completed)
  }
}
