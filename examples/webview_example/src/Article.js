import React, { Component } from 'react'
import { StyleSheet, WebView } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
})

export default class Article extends Component {
  render() {
    return (
      <WebView
        style={styles.container}
        source={{uri: this.props.url}} />
      )
  }
}
