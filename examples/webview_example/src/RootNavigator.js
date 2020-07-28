import React, { Component } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Article from './Article';
import ArticleList from './ArticleList';

const Stack = createStackNavigator();

export default class RootNavigator extends Component {
  constructor(props) {
    super(props)
    this.state = {

    };
  }

  render() {
    return(
      <Stack.Navigator>
        <Stack.Screen name='ArticleList' component={ArticleList} options={{title: 'The Planets'}} />
        <Stack.Screen name='Article' component={Article} options={({route}) => ({title: route.params.title})}/>
      </Stack.Navigator>
    );
  }
};
