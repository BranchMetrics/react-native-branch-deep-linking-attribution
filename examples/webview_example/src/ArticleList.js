import React, { Component } from 'react'
import { Text, Image, ListView, StyleSheet, TouchableHighlight, View } from 'react-native'

import branch from 'react-native-branch'

import Article from './Article'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
})

class ArticleList extends Component {
  _unsubscribeFromBranch = null

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([
        { title: 'Mercury', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg' },
        { title: 'Venus', url: 'https://en.wikipedia.org/wiki/Venus', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg' },
        { title: 'Earth', url: 'https://en.wikipedia.org/wiki/Earth', image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg' },
        { title: 'Mars', url: 'https://en.wikipedia.org/wiki/Mars', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
        { title: 'Jupiter', url: 'https://en.wikipedia.org/wiki/Jupiter', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
        { title: 'Saturn', url: 'https://en.wikipedia.org/wiki/Saturn', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Saturn-27-03-04.jpeg' },
        { title: 'Uranus', url: 'https://en.wikipedia.org/wiki/Uranus', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg' },
        { title: 'Neptune', url: 'https://en.wikipedia.org/wiki/Neptune', image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg' },
        { title: 'Pluto', url: 'https://en.wikipedia.org/wiki/Pluto', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg' },
      ]),
    }
  }

  componentDidMount() {
    branch.key = 'key_test_jmzd0lUR9gIiAAEQfo42onbcExe1MeHg'
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
      this.props.navigation.navigate('Article', { url: url, title: title, image: image })
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
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) =>
          <TouchableHighlight
            onPress={() => { this._showArticle(data) }}>
            <View
              style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 80, height: 80}}
                source={{uri: data.image}}/>
              <Text
                style={{fontWeight: 'bold', fontSize: 17, margin: 20}}>
                {data.title}
              </Text>
            </View>
          </TouchableHighlight>}
      />
    )
  }

  _showArticle(data) {
    console.log("Show article with URL " + data.url)
    this.props.navigation.navigate('Article', data)
  }
}

export default ArticleList
