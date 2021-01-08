import React, { Component } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import Button from './Button'

import branch, { RegisterViewEvent, BranchEvent } from 'react-native-branch'

const defaultBUO = {
  title: 'wallo'
}

class BranchMethods extends Component {

  buo = null

  state = {
    results: [],
  }

  componentWillUnmount() {
    if (!this.buo) return
    this.buo.release()
  }

  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject('abc', defaultBUO)
      if (this.buo) this.buo.release()
      this.buo = result
      console.log('createBranchUniversalObject', result)
      this.addResult('success', 'createBranchUniversalObject', result)
    } catch (err) {
      console.log('createBranchUniversalObject err', err.toString())
      this.addResult('error', 'createBranchUniversalObject', err.toString())
    }
  }

  generateShortUrl = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let result = await this.buo.generateShortUrl()
      console.log('generateShortUrl', result)
      this.addResult('success', 'generateShortUrl', result)
    } catch (err) {
      console.log('generateShortUrl err', err)
      this.addResult('error', 'generateShortUrl', err.toString())
    }
  }

  listOnSpotlight = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let result = await this.buo.listOnSpotlight()
      console.log('listOnSpotlight', result)
      this.addResult('success', 'listOnSpotlight', result)
    } catch (err) {
      console.log('listOnSpotlight err', err.toString())
      this.addResult('error', 'listOnSpotlight', err.toString())
    }
  }

  showShareSheet = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let result = await this.buo.showShareSheet()
      console.log('showShareSheet', result)
      this.addResult('success', 'showShareSheet', result)
    } catch (err) {
      console.log('showShareSheet err', err.toString())
      this.addResult('error', 'showShareSheet', err.toString())
    }
  }

  redeemRewards = async (bucket) => {
    try {
      let result = await branch.redeemRewards(5, bucket)
      console.log('redeemRewards', result)
      this.addResult('success', 'redeemRewards', result)
    } catch (err) {
      console.log('redeemRewards err', {...err}, err.message, err.toString())
      this.addResult('error', 'redeemRewards', err.toString())
    }
  }

  loadRewards = async() => {
    try {
      let result = await branch.loadRewards()
      console.log('loadRewards', result)
      this.addResult('success', 'loadRewards', result)
    } catch (err) {
      console.log('loadRewards err', err.toString())
      this.addResult('error', 'loadRewards', err.toString())
    }
  }

  getCreditHistory = async() => {
    try {
      let result = await branch.getCreditHistory()
      console.log('getCreditHistory', result)
      this.addResult('success', 'getCreditHistory', result)
    } catch (err) {
      console.log('getCreditHistory err', err.toString())
      this.addResult('error', 'getCreditHistory', err.toString())
    }
  }

  userCompletedAction = async() => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let result = await this.buo.userCompletedAction(RegisterViewEvent)
      console.log('userCompletedAction', result)
      this.addResult('success', 'userCompletedAction', result)
    } catch (err) {
      console.log('userCompletedAction err', err.toString())
      this.addResult('error', 'userCompletedAction', err.toString())
    }
  }

  sendCommerceEvent = async() => {
    try {
      let result = await branch.sendCommerceEvent(20.00, {"key": "value"})

      console.log('sendCommerceEvent', result)
      this.addResult('success', 'sendCommerceEvent', result)
    } catch (err) {
      console.log('sendCommerceEvent err', err.toString())
      this.addResult('error', 'sendCommerceEvent', err.toString())
    }
  }

  disableTracking = async () => {
    try {
      let disabled = await branch.isTrackingDisabled()
      branch.disableTracking(!disabled)
      disabled = await branch.isTrackingDisabled()
      let status = disabled ? 'Tracking Disabled' : 'Tracking Enabled'
      console.log('disableTracking', status)
      this.addResult('success', 'disableTracking', status)
    } catch (err) {
      console.log('disableTracking err', err)
      this.addResult('error', 'disableTracking', err.toString())
    }
  }

  isTrackingDisabled = async () => {
    try {
      let disabled = await branch.isTrackingDisabled()
      let status = disabled ? 'Tracking is Disabled' : 'Tracking is Enabled'
      console.log('isTrackingDisabled', status)
      this.addResult('success', 'isTrackingDisabled', status)
    } catch (err) {
      console.log('isTrackingDisabled err', err)
      this.addResult('error', 'isTrackingDisabled', err.toString())
    }
  }

  logStandardEvent = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let branchEvent = new BranchEvent(
        BranchEvent.Purchase,
        this.buo,
        {
          transactionID: '12344555',
          currency: 'USD',
          revenue: 1.5,
          shipping: 10.2,
          tax: 12.3,
          coupon: 'test_coupon',
          affiliation: 'test_affiliation',
          description: 'Test purchase event',
          searchQuery: 'test keyword',
          customData: {
            "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
            "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
          },
          alias: 'ItemViewed'
        }
      )
      branchEvent.logEvent()

      this.addResult('success', 'sendStandardEvent', branchEvent)
    } catch (err) {
      console.log('sendStandardEvent err', err)
      this.addResult('error', 'sendStandardEvent', err.toString())
    }
  }

  logCustomEvent = async () => {
    if (!this.buo) await this.createBranchUniversalObject()
    try {
      let branchEvent = new BranchEvent(
        'Test Custom Event Name',
        this.buo,
        {
          transactionID: '12344555',
          currency: 'USD',
          revenue: 1.5,
          shipping: 10.2,
          tax: 12.3,
          coupon: 'test_coupon',
          affiliation: 'test_affiliation',
          description: 'Test purchase event',
          searchQuery: 'test keyword',
          customData: {
            "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
            "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
          }
        }
      )
      branchEvent.logEvent()

      this.addResult('success', 'sendStandardEvent', branchEvent)
    } catch (err) {
      console.log('sendStandardEvent err', err)
      this.addResult('error', 'sendStandardEvent', err.toString())
    }
  }

  openURL = async () => {
    const url = 'https://zjef.test-app.link/n4efBZnSu8';
    try {
      await branch.openURL(url);
      this.addResult('success', 'openURL', url);
    }
    catch (err) {
      this.addResult('error', 'openURL', err.toString());
    }
  }

  lastAttributedTouchDataWithAttributionWindow = async() => {
    const attributionWindow = 365
    try {
      let latd = await branch.lastAttributedTouchDataWithAttributionWindow(attributionWindow)
        console.log('lastAttributedTouchDataWithAttributionWindow', latd)
        this.addResult('success', 'lastAttributedTouchDataWithAttributionWindow', latd)
    } catch (err) {
      console.log('lastAttributedTouchDataWithAttributionWindow', err)
      this.addResult('error', 'lastAttributedTouchDataWithAttributionWindow', err.toString())
    }
  }

  addResult(type, slug, payload) {
    let result = { type, slug, payload }
    this.setState({
      results: [result, ...this.state.results].slice(0, 10)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.header}>RESULTS</Text>
          <ScrollView style={styles.scrollContainer}>
            {this.state.results.length === 0 && <Text>No Results yet, run a method below</Text>}
            {this.state.results.map((result, i) => {
              return (
                <View key={i} style={styles.result}>
                  <Text style={result.type === 'success' ? styles.textSucccess : styles.textError}>{`${result.slug} (${result.type})`}</Text>
                  <Text style={styles.textSmall}>{JSON.stringify(result.payload, null, 2)}</Text>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <Text style={styles.header}>METHODS</Text>
        <ScrollView style={styles.buttonsContainer}>
          <Button onPress={this.disableTracking}>disableTracking (switch on/off)</Button>
          <Button onPress={this.isTrackingDisabled}>isTrackingDisabled</Button>
          <Button onPress={this.createBranchUniversalObject}>createBranchUniversalObject</Button>
          <Button onPress={this.userCompletedAction}>userCompletedAction</Button>
          <Button onPress={this.sendCommerceEvent}>sendCommerceEvent</Button>
          <Button onPress={this.generateShortUrl}>generateShortUrl</Button>
          <Button onPress={this.listOnSpotlight}>listOnSpotlight</Button>
          <Button onPress={this.showShareSheet}>showShareSheet</Button>
          <Button onPress={this.redeemRewards.bind(this, '')}>redeemRewards</Button>
          <Button onPress={this.redeemRewards.bind(this, 'testBucket')}>redeemRewards (with bucket)</Button>
          <Button onPress={this.loadRewards}>loadRewards</Button>
          <Button onPress={this.getCreditHistory}>getCreditHistory</Button>
          <Button onPress={this.logStandardEvent}>BranchEvent.logEvent (Standard)</Button>
          <Button onPress={this.logCustomEvent}>BranchEvent.logEvent (Custom)</Button>
          <Button onPress={this.openURL}>openURL</Button>
          <Button onPress={this.lastAttributedTouchDataWithAttributionWindow}>lastAttributedTouchDataWithAttributionWindow</Button>
        </ScrollView>
      </View>
    )
  }
}

export default BranchMethods

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
  },
  header: {
    backgroundColor: '#ccc',
    padding: 5,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultsContainer: {
    height: 200,
  },
  scrollContainer: {
    padding: 5,
  },
  result: {
    padding: 5,
  },
  textSmall: {
    fontSize: 10,
  },
  textSucccess: {
    color: '#6c9c5d',
  },
  textError: {
    color: '#a03d31',
  },
  buttonsContainer: {
    flex: 1,
  }
})
