import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch } = NativeModules
const nativeEventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(RNBranch) : DeviceEventEmitter

import createBranchUniversalObject from './branchUniversalObject'

const INIT_SESSION_SUCCESS = 'RNBranch.initSessionSuccess'
const INIT_SESSION_ERROR = 'RNBranch.initSessionError'

class Branch {

  _initSessionResult = null;
  _lastParams = null;
  _listeners = [];
  _patientInitSessionObservers = [];

  constructor() {
    // listen for initSession results and errors.
    nativeEventEmitter.addListener(INIT_SESSION_SUCCESS, this._onInitSessionResult)
    nativeEventEmitter.addListener(INIT_SESSION_ERROR, this._onInitSessionResult)

    this._processInitSession()
  }

  /*** RNBranch Deep Linking ***/
  async _processInitSession() {
    // retrieve the last initSession if it exists
    let result = await RNBranch.getInitSessionResult()
    if (result) this._onInitSessionResult(result)
  }

  _onInitSessionResult = (result) => {
    this._initSessionResult = result

    this._patientInitSessionObservers.forEach((cb) => cb(result))
    this._listeners.forEach(cb => cb(result))

    this._lastParams = result.params
    this._patientInitSessionObservers = []
  };

  getInitSession(cb) {
    if(this._initSessionResult) return cb(this._initSessionResult)
    this._patientInitSessionObservers.push(cb)
  }

  subscribe(listener) {
    if (this._initSessionResult) listener(this._initSessionResult)
    this._listeners.push(listener)
    const unsubscribe = () => {
      let index = this._listeners.indexOf(listener)
      this._listeners.splice(index, 1)
    }
    return unsubscribe
  }

  /*** RNBranch singleton methods ***/
  setDebug = RNBranch.setDebug
  getLatestReferringParams = RNBranch.getLatestReferringParams
  getFirstReferringParams = RNBranch.getFirstReferringParams
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  logout = RNBranch.logout
  userCompletedAction = (event, state = {}) => RNBranch.userCompletedAction(event, state)
  getShortUrl = RNBranch.getShortUrl

  /*** Referral Methods ***/
  redeemRewards = (amount, bucket) => RNBranch.redeemRewards(amount, bucket)
  loadRewards = RNBranch.loadRewards
  getCreditHistory = RNBranch.getCreditHistory

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject
}

export default new Branch()
