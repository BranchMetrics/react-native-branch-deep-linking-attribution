import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, WebView } from 'react-native'

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
  render() {
    return (
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
      </View>
    )
  }

  async onShare() {
    // TODO
  }
}
