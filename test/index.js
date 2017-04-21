import test from 'ava'
import React from 'react-native'
const { RNBranch } = React.NativeModules

import branch, {
  AddToCartEvent,
  AddToWishlistEvent,
  PurchasedEvent,
  PurchaseInitiatedEvent,
  RegisterViewEvent,
  ShareCompletedEvent,
  ShareInitiatedEvent,
  DEFAULT_INIT_SESSION_TTL
} from '../src/index.js'

test.beforeEach(() => {
  branch.initSessionTtl = DEFAULT_INIT_SESSION_TTL
})

test('subscribe returns init session', t => {
  return new Promise((resolve, reject) => {
    branch.subscribe((session) => {
      resolve()
    })
  })
})

test('subscribe does not return init session beyond the TTL', t => {
  branch.initSessionTtl = 0 // disable the cache check in this test

  return new Promise((resolve, reject) => {
    let listenerWasCalled = false
    branch.subscribe(({ error, params, uri }) => {
      listenerWasCalled = true
      reject('subscribe listener should not be called')
    })

    setTimeout(() => {
      if (!listenerWasCalled) resolve()
      // else reject() was already called
    }, 100)
  })
})

test.serial('subscribe does not add an event listener within the TTL until redeemInitSession returns', t => {
  /*
   * Desperately want a mock framework for this
   */

  // Modify the NativeEventEmitter used by branch to track whether a listener has been added
  const emitter = branch.nativeEventEmitter
  this.listenerAdded = false
  const originalAddListener = emitter.addListener
  emitter.addListener = (event, listener) => {
    this.listenerAdded = true
  }

  // Modify RNBranch.redeemInitSessionResult to check whether a listener has been added
  const originalRedeemInitSessionResult = RNBranch.redeemInitSessionResult
  RNBranch.redeemInitSessionResult = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        t.false(this.listenerAdded)
        resolve({error: null, params: null, uri: null})
      }, 100)
    })
  }

  return new Promise((resolve, reject) => {
    branch.subscribe(({error, params, uri}) => {})

    setTimeout(() => {
      this.listenerAdded ? resolve() : reject('listener was not added')

      emitter.addListener = originalAddListener
      RNBranch.redeemInitSessionResult = originalRedeemInitSessionResult
    }, 200)
  })
})

test.serial('after the TTL, subscribe adds a listener and does not call redeemInitSessionResult', t => {
  /*
   * Desperately want a mock framework for this
   */

  // Modify the NativeEventEmitter used by branch to track whether a listener was added
  const emitter = branch.nativeEventEmitter
  this.listenerAdded = false
  const originalAddListener = emitter.addListener
  emitter.addListener = (event, listener) => {
    this.listenerAdded = true
  }

  // Modify RNBranch.redeemInitSessionResult to check whether it is called at all
  const originalRedeemInitSessionResult = RNBranch.redeemInitSessionResult
  RNBranch.redeemInitSessionResult = () => {
    t.fail('redeemInitSessionResult should not be called')
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  branch.initSessionTtl = 0 // disable the cache check in this test

  return new Promise((resolve, reject) => {
    branch.subscribe(({error, params, uri}) => {})

    setTimeout(() => {
      this.listenerAdded ? resolve() : reject('listener was not added')

      emitter.addListener = originalAddListener
      RNBranch.redeemInitSessionResult = originalRedeemInitSessionResult
    }, 100)
  })

})

// constant mapping
test('AddToCartEvent is correct', t => {
  t.is(RNBranch.ADD_TO_CART_EVENT, AddToCartEvent)
})

test('AddToWishlistEvent is correct', t => {
  t.is(RNBranch.ADD_TO_WISHLIST_EVENT, AddToWishlistEvent)
})

test('PurchasedEvent is correct', t => {
  t.is(RNBranch.PURCHASED_EVENT, PurchasedEvent)
})

test('PurchaseInitiatedEvent is correct', t => {
  t.is(RNBranch.PURCHASE_INITIATED_EVENT, PurchaseInitiatedEvent)
})

test('RegisterViewEvent is correct', t => {
  t.is(RNBranch.REGISTER_VIEW_EVENT, RegisterViewEvent)
})

test('ShareCompletedEvent is correct', t => {
  t.is(RNBranch.SHARE_COMPLETED_EVENT, ShareCompletedEvent)
})

test('ShareInitiatedEvent is correct', t => {
  t.is(RNBranch.SHARE_INITIATED_EVENT, ShareInitiatedEvent)
})
