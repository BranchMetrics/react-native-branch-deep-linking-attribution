import React, { Component } from 'react'
import { Button, ListView, StyleSheet } from 'react-native'

import Article from './Article'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
})

class ArticleList extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([
        { title: 'Mercury', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)' },
        { title: 'Venus', url: 'https://en.wikipedia.org/wiki/Venus' },
        { title: 'Earth', url: 'https://en.wikipedia.org/wiki/Earth' },
        { title: 'Mars', url: 'https://en.wikipedia.org/wiki/Mars' },
        { title: 'Jupiter', url: 'https://en.wikipedia.org/wiki/Jupiter' },
        { title: 'Saturn', url: 'https://en.wikipedia.org/wiki/Saturn' },
        { title: 'Uranus', url: 'https://en.wikipedia.org/wiki/Uranus' },
        { title: 'Neptune', url: 'https://en.wikipedia.org/wiki/Neptune' },
        { title: 'Pluto', url: 'https://en.wikipedia.org/wiki/Pluto' },
      ]),
    }
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) =>
          <Button
            title={data.title}
            onPress={() => { this._showArticle(data) }}>
          </Button>}
      />
    )
  }

  _showArticle(data) {
    console.log("Show article with URL " + data.url)
    this.props.navigator.push(data)
  }
}

export default ArticleList
