import React, { Component } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components'

import ArticleList from './ArticleList'
import Article from './Article'

export default class App extends Component {
  navigator = null

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
