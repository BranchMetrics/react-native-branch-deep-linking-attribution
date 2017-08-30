import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components'

import branch from 'react-native-branch'

import ArticleList from './ArticleList'
import Article from './Article'

export default class App extends Component {
  _unsubscribeFromBranch = null
  navigator = null

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
      this.navigator.push({ title: title, url: url, image: image })
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
      <Navigator
        initialRoute={{ title: "The Planets", url: null }}
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
                Title: (route, navigator, index, navState) => { return (
                  <Text
                    style={{fontSize: 23, fontWeight: 'bold'}}>
                    {route.title}
                  </Text>
                ) },
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
