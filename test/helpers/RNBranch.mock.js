import React from 'react-native'

const defaultSession = {params: {}, error: null}

React.NativeModules.RNBranch = {
  redeemInitSessionResult() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(defaultSession), 500)
    })
  }
}
