import { NativeModules, NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

// According to the React Native docs from 0.21, NativeAppEventEmitter is used for native iOS modules to emit events. DeviceEventEmitter is used for native Android modules.
// Both are technically supported on Android -- but I chose to follow the suggested route by the documentation to minimize the risk of this code breaking with a future release
// in case NativeAppEventEmitter ever got deprecated on Android
const nativeEventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter
const { RNBranch } = NativeModules

const INIT_SESSION_SUCCESS = 'RNBranch.initSessionSuccess'
const INIT_SESSION_ERROR = 'RNBranch.initSessionError'

class Branch {

  _lastParams = null;
  _listeners = [];
  _patientInitSessionObservers = [];

  constructor() {
    // listen for initSession results and errors.
    nativeEventEmitter.addListener(INIT_SESSION_SUCCESS, this._onInitSessionResult)
    nativeEventEmitter.addListener(INIT_SESSION_ERROR, this._onInitSessionResult)

    // retrieve the last initSession if it exists
    RNBranch.getInitSessionResult((result) => {
      if (result) this._onInitSessionResult(result)
    })

    // clear the initial observers
    this._patientInitSessionObservers = []
  }

  _onInitSessionResult = (result) => {
    this._initSessionResult = result

    this._patientInitSessionObservers.forEach((cb) => cb(result))
    if (this._isNewResult(result)) this._listeners.forEach(cb => cb(result))

    this._lastParams = result.params
    this._patientInitSessionObservers = []
  };

  // filter duplicate results (as observed in android. further investigation required) [rt2zz]
  _isNewResult({params}) {
    return (!this._lastParams || this._lastParams['~id'] !== params['~id'] || this._lastParams['+click_timestamp'] !== params['+click_timestamp'])
  }

  getInitSessionResultPatiently = (cb) => {
    if(this._initSessionResult) return cb(this._initSessionResult)
    this._patientInitSessionObservers.push(cb)
  }

  subscribe(listener) {
    this._listeners.push(listener)
    const unsubscribe = () => {
      let index = this._listeners.indexOf(listener)
      this._listeners.splice(index, 1)
    }
    return unsubscribe
  }

  setDebug() {
    RNBranch.setDebug()
  }

  getLatestReferringParams(cb) {
    RNBranch.getLatestReferringParams(cb)
  }

  getFirstReferringParams(cb) {
    RNBranch.getFirstReferringParams(cb)
  }

  setIdentity(identity) {
    RNBranch.setIdentity(identity)
  }

  logout() {
    RNBranch.logout()
  }

  userCompletedAction(event, state = {}) {
    RNBranch.userCompletedAction(event, state)
  }

  showShareSheet(shareOptions = {}, branchUniversalObject = {}, linkProperties = {}, callback = () => {}) {
    shareOptions = {
      messageHeader: 'Check this out!',
      messageBody: 'Check this cool thing out',
      ...shareOptions,
    }
    branchUniversalObject = {
      canonicalIdentifier: 'RNBranchSharedObjectId',
      contentTitle: 'Cool Content!',
      contentDescription: 'Cool Content Description',
      contentImageUrl: '',
      ...branchUniversalObject,
    }
    linkProperties = {
      feature: 'share',
      channel: 'RNApp',
      ...linkProperties,
    }

    RNBranch.showShareSheet(shareOptions, branchUniversalObject, linkProperties, ({channel, completed, error}) => callback({channel, completed, error}))
  }

  getShortUrl() {
    return RNBranch.getShortUrl()
  }
}

export default new Branch()
