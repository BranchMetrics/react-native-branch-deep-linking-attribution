import React, { Component } from 'react'
import { Text, Image, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native'

import Article from './Article'

class ArticleList extends Component {
  // Step 2: Add _unsubscribeFromBranch property

  constructor(props) {
    super(props)

    this.state = {
      listData: props.listData || [
        { title: 'Mercury', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg' },
        { title: 'Venus', url: 'https://en.wikipedia.org/wiki/Venus', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg' },
        { title: 'Earth', url: 'https://en.wikipedia.org/wiki/Earth', image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg' },
        { title: 'Mars', url: 'https://en.wikipedia.org/wiki/Mars', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
        { title: 'Jupiter', url: 'https://en.wikipedia.org/wiki/Jupiter', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
        { title: 'Saturn', url: 'https://en.wikipedia.org/wiki/Saturn', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Saturn-27-03-04.jpeg' },
        { title: 'Uranus', url: 'https://en.wikipedia.org/wiki/Uranus', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg' },
        { title: 'Neptune', url: 'https://en.wikipedia.org/wiki/Neptune', image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg' },
        { title: 'Pluto', url: 'https://en.wikipedia.org/wiki/Pluto', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg' },
      ],
    }
  }

  // Step 3: Add componentDidMount

  // Step 4: Add componentWillUnmount

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.listData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <TouchableHighlight
              onPress={() => { this._showArticle(item) }}>
              <View style={styles.item}>
                <Image
                  style={styles.image}
                  source={{uri: item.image}}/>
                <Text
                  style={styles.label}>
                  {item.title}
                </Text>
              </View>
            </TouchableHighlight>}
        />
      </View>
    )
  }

  _showArticle(data) {
    console.log("Show article with URL " + data.url)
    this.props.navigation.navigate('Article', data)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 0,
  },
  item: {
    height: 88,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginLeft: 8
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    margin: 20,
  },
})

export default ArticleList
