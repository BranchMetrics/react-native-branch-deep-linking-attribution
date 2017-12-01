import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, WebView } from 'react-native'

import branch, { BranchEvent } from 'react-native-branch'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64
  },
  textInput: {
    flex: 0.08
  },
  webView: {
    flex: 0.77
  },
  buttonText: {
    color: '#2266aa',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default class App extends Component {
  _unsubscribeFromBranch = null
  buo = null

  constructor(props) {
    super(props)
    this.state = { text: 'Enter Branch URL', url: '' }
  }

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

      // Now reload the webview
      this.setState({url: url, title: title, image: image})
    })
  }

  componentWillUnmount() {
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch()
      this._unsubscribeFromBranch = null
    }

    if (this.buo) {
      this.buo.release()
      this.buo = null
    }
  }

  render() {
    return (
      <View
        style={styles.container} >
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text: text})}
          onEndEditing={this.editingEnded.bind(this)}
          value={this.state.text} />
        <WebView
          style={styles.webView}
          source={{uri: this.state.url}}
          onLoad={this.registerView.bind(this)} />
      </View>
    )
  }

  editingEnded() {
    // branch.openURL(this.state.text)
    branch.openURL(this.state.text, {newActivity: true})
  }

  async registerView() {
    if (this.buo) this.buo.release()
    if (this.state.url === '') return

    this.buo = await branch.createBranchUniversalObject("url/" + this.state.url, {
      canonicalUrl: this.state.url,
      title: this.state.title,
      contentImageUrl: this.state.image
    })
    this.buo.logEvent(BranchEvent.ViewItem)
    console.log("Created Branch Universal Object and logged standard view item event.")
  }
}
