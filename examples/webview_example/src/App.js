import React, { Component } from 'react'
import { Button, Navigator, StyleSheet, Text, View } from 'react-native'

import ArticleList from './ArticleList'
import Article from './Article'

export default class App extends Component {
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
            if (!route.url) {
              return <ArticleList navigator={navigator} />
            }
            return <Article
              title={route.title}
              url={route.url}
              navigator={navigator} />
          }}
      />
    )
  }
}
