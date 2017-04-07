import React from 'react-native'

const defaultSession = {params: {}, error: null}

React.NativeModules.RNBranch = {
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
