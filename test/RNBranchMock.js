import { NativeModules } from 'react-native'

NativeModules.RNBranch = {
  INIT_SESSION_START: 'RNBranch.initSessionStart',
  INIT_SESSION_SUCCESS: 'RNBranch.initSessionSuccess',
  INIT_SESSION_ERROR: 'RNBranch.initSessionError',

  redeemInitSessionResult: jest.fn(() => Promise.resolve({
    params: {
      '+clicked_branch_link': false,
      '+is_first_session': false,
    },
    error: null,
    uri: null,
  })),
}

NativeModules.RNBranchEventEmitter = {
  addListener: jest.fn(eventType => {}),
  removeListener: jest.fn(count => {}),
}
