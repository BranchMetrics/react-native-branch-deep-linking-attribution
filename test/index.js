import test from 'ava'
import React from 'react-native'
import { mock, unmock } from './helpers/RNBranch.mock'
const { RNBranch } = React.NativeModules

import branch, {
  AddToCartEvent,
  AddToWishlistEvent,
  PurchasedEvent,
  PurchaseInitiatedEvent,
  RegisterViewEvent,
  ShareCompletedEvent,
  ShareInitiatedEvent
} from '../src/index.js'

test.beforeEach(() => {
  branch._checkCachedEvents = true
})

test.afterEach(() => {
  unmock()
})

test('subscribe returns init session', t => {
  return new Promise((resolve, reject) => {
    branch.subscribe((session) => {
      resolve()
    })
  })
})

test('subscribe returns cached init session with cached_initial_event flag', t => {
  mock(RNBranch, 'redeemInitSessionResult', () => {
    return new Promise((resolve, reject) => {
      resolve({error: null, params: {}, uri: 'test'})
    })
  })

  return new Promise((resolve, reject) => {
    let event_received = false
    branch.subscribe(({ error, params, uri }) => {
      event_received = true
      if(params.cached_initial_event)
        resolve()
      else
        reject('cached_initial_event is not set')
    })

    setTimeout(() => {
      if(!event_received)
        reject('event not received')
    }, 100)
  })
})

test('subscribe does not call redeemInitSessionResult if skipCachedEvents is called', t => {
  mock(RNBranch, 'redeemInitSessionResult', () => {
    return new Promise((resolve, reject) => {
      resolve({error: null, params: null, uri: null})
    })
  })

  return new Promise((resolve, reject) => {
    branch.skipCachedEvents()
    branch.subscribe(({ error, params, uri }) => {
      reject('cached initial session event returned')
    })

    setTimeout(() => {
      resolve()
    }, 100)
  })
})

test.serial('subscribe does not add an event listener before redeemInitSession returns', t => {
  /*
   * Desperately want a mock framework for this
   */

  // Modify the NativeEventEmitter used by branch to track whether a listener has been added
  this.listenerAdded = false
  mock(branch.nativeEventEmitter, 'addListener', (event, listener) => {
    this.listenerAdded = true
  })

  // Modify RNBranch.redeemInitSessionResult to check whether a listener has been added
  mock(RNBranch, 'redeemInitSessionResult', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        t.false(this.listenerAdded)
        resolve({error: null, params: {}, uri: null})
      }, 100)
    })
  })

  return new Promise((resolve, reject) => {
    branch.subscribe(({error, params, uri}) => {})

    setTimeout(() => {
      this.listenerAdded ? resolve() : reject('listener was not added')
    }, 200)
  })
})

test.serial('once skipCachedEvents is called, subscribe adds a listener and does not call redeemInitSessionResult', t => {
  /*
   * Desperately want a mock framework for this
   */

  // Modify the NativeEventEmitter used by branch to track whether a listener was added
  this.listenerAdded = false
  mock(branch.nativeEventEmitter, 'addListener', (event, listener) => {
    this.listenerAdded = true
  })

  // Modify RNBranch.redeemInitSessionResult to check whether it is called at all
  mock(RNBranch, 'redeemInitSessionResult', () => {
    t.fail('redeemInitSessionResult should not be called')
    return new Promise((resolve, reject) => {
      resolve({})
    })
  })

  branch.skipCachedEvents() // disable the cache check in this test

  return new Promise((resolve, reject) => {
    branch.subscribe(({error, params, uri}) => {})

    setTimeout(() => {
      this.listenerAdded ? resolve() : reject('listener was not added')
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
