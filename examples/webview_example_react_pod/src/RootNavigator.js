import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Article from './Article';
import ArticleList from './ArticleList';

const RootNavigator = createStackNavigator({
  Home: {
    screen: ArticleList,
  },
  Article: {
    screen: Article,
  }
});

export default createAppContainer(RootNavigator);
