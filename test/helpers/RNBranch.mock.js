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
