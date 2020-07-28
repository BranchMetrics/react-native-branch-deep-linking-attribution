import React, { Component } from 'react';
import RootNavigator from './RootNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    );
  }
};
