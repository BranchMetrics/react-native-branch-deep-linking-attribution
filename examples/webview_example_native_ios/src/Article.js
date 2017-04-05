import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, WebView } from 'react-native'

import branch, { RegisterViewEvent } from 'react-native-branch'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64
  },
  webView: {
    flex: 0.85
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

  constructor() {
    super()
    console.log("In constructor: ")
    this._dumpProps(this.props)
  }

  _dumpProps(props) {
    console.log("Props: " + JSON.stringify(props))
  }

  componentWillReceiveProps(nextProps) {
    console.log("In componentWillReceiveProps:")
    console.log("this.props: ")
    this._dumpProps(this.props)
    console.log("Next props: ")
    this._dumpProps(nextProps)
  }

  async componentWillMount() {
    console.log("in componentWillMount:")
    this._dumpProps(this.props)

    if (!this.props.route) return

    this.buo = await branch.createBranchUniversalObject("planet/" + this.props.route.title, {
      automaticallyListOnSpotlight: true, // ignored on Android
      canonicalUrl: this.props.route.url,
      title: this.props.route.title,
      contentImageUrl: this.props.route.image,
      contentIndexingMode: 'public' // for Spotlight indexing
    })
    this.buo.userCompletedAction(RegisterViewEvent)
    console.log("Created Branch Universal Object and logged RegisterViewEvent.")
  }

  componentWillUnmount() {
    if (!this.buo) return
    this.buo.release()
  }

  render() {
    console.log("in render:")
    this._dumpProps(this.props)
    return (
      this.props.route ?
      <View
        style={styles.container} >
        <WebView
          style={styles.webView}
          source={{uri: this.props.route.url}} />
        <TouchableHighlight
          onPress={() => this.onShare()}
          style={styles.button} >
          <Text
            style={styles.buttonText}>
            Share
          </Text>
        </TouchableHighlight>
      </View> :
      <View/>
    )
  }

  async onShare() {
    if (!this.props.route) return

    let { channel, completed, error } = await this.buo.showShareSheet({
      emailSubject: "The Planet " + this.props.route.title,
      messageBody: "Read about the planet " + this.props.route.title + ".",
      messageHeader: "The Planet " + this.props.route.title
    }, {
      feature: "share",
      channel: "RNApp"
    }, {
      $desktop_url: this.props.route.url
    })

    if (error) {
      console.error("Error sharing via Branch: " + error)
      return
    }

    console.log("Share to " + channel + " completed: " + completed)
  }
}
