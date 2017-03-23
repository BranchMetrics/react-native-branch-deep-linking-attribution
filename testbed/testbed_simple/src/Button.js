import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

const Button = ({ children, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} >
      <Text style={styles.text}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  }
})
