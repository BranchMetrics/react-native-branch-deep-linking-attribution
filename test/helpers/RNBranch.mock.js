import React from 'react-native'

const defaultSession = {params: {}, error: null}

React.NativeModules.RNBranch = {
  // Mock constants exported by native layers
  ADD_TO_CART_EVENT: 'Add to Cart',
  ADD_TO_WISHLIST_EVENT: 'Add to Wishlist',
  PURCHASE_INITIATED_EVENT: 'Purchase Started',
  PURCHASED_EVENT: 'Purchased',
  REGISTER_VIEW_EVENT: 'View',
  SHARE_COMPLETED_EVENT: 'Share Completed',
  SHARE_INITIATED_EVENT: 'Share Started',

  redeemInitSessionResult() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(defaultSession), 500)
    })
  }
}

// This only has to exist to be passed to the NativeEventEmitter
// constructor.
React.NativeModules.RNBranchEventEmitter = {
}

/*
 * Ad hoc mocking mechanism. Example:
 *

  import { mock, unmock } from './helpers/RNBranch.mock'

  test.afterEach(() => {
    unmock() // restores all mocked methods to original values
  })

  test('example test', t => {
    this.listenerWasAdded = false

    mock(eventEmitter, 'addListener', (event, listener) => {
      this.listenerWasAdded = true
    })

    eventEmitter.addListener('EventName', (event) => {})

    t.true(this.listenerWasAdded)
  })

 */
let mockedMethods = []

export function mock(object: Object, methodName: String, mockMethod: Function) {
  const originalMethod = object[methodName]
  if (typeof(originalMethod) != 'function') {
    console.warn(methodName + ' is not a method on ' + object)
    return
  }
  object[methodName] = mockMethod
  mockedMethods.push({object: object, method: methodName, original: originalMethod})
}

export function unmock() {
  mockedMethods.forEach(({object, method, original}) => object[method] = original)
  mockedMethods = []
}
