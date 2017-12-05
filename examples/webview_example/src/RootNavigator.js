import React from 'react';
import { StackNavigator } from 'react-navigation';
import Article from './Article';
import ArticleList from './ArticleList';

const RootNavigator = StackNavigator({
  Home: {
    screen: ArticleList,
    navigationOptions: {
      headerTitle: 'The Planets'
    }
  },
  Article: {
    screen: Article,
    navigationOptions: ({navigation}) => ({
      headerTitle: navigation.state.params.title
    })
  }
});

export default RootNavigator;
