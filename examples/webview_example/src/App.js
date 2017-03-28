import React, { Component } from 'react'
import { Button, Navigator, StyleSheet, Text, View } from 'react-native'

import branch from 'react-native-branch'

import ArticleList from './ArticleList'
import Article from './Article'

export default class App extends Component {
  _unsubscribeFromBranch = null
  navigator = null

  componentWillMount() {
    this._unsubscribeFromBranch = branch.subscribe((bundle) => {
      if (!bundle) return

      if (bundle.error) {
        console.error("Error opening Branch link: " + bundle.error)
        return
      }

      if (!bundle.params) return

      // Get title and url for route
      let title = bundle.params.$og_title
      let url = bundle.params.$canonical_url

      // Now push the view for this URL
      this.navigator.push({ title: title, url: url })
    })
  }

  componentWillUnmount() {
    if (this._unsubscribeFromBranch) this._unsubscribeFromBranch()
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: "Planets", url: null }}
        navigationBar={
           <Navigator.NavigationBar
             routeMapper={{
                LeftButton: (route, navigator, index, navState) => {
                  if (route.url) return (
                    <Button
                      onPress={() => {navigator.pop()}}
                      title={"Back"} />
                  )

                  return <View />
                },
                RightButton: (route, navigator, index, navState) => {
                  return <View />
                },
                Title: (route, navigator, index, navState) => { return (<Text>{route.title}</Text>) },
             }}
           />
         }
        renderScene={(route, navigator) => {
          // hack
          this.navigator = navigator

          if (!route.url) {
            return <ArticleList navigator={navigator} />
          }
          return <Article route={route} />
        }} />
    )
  }
}
