import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, WebView } from 'react-native'

// Step 5: Import branch and BranchEvent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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
  // Step 6: Add buo property

  // Step 7: Add componentDidMount

  // Step 8: Add componentWillUnmount

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
    // Step 9: Implement onShare
  }
}
