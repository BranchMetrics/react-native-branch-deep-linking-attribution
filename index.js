import { NativeModules, NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native';

// According to the React Native docs from 0.21, NativeAppEventEmitter is used for native iOS modules to emit events. DeviceEventEmitter is used for native Android modules.
// Both are technically supported on Android -- but I chose to follow the suggested route by the documentation to minimize the risk of this code breaking with a future release
// in case NativeAppEventEmitter ever got deprecated on Android
const nativeEventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
const { RNBranch } = NativeModules;

const INIT_SESSION_EVENT = 'RNBranch.initSessionFinished';

class Branch {

  _listeners = [];
  _lastParams = [];

  constructor() {
    //We listen to the initialization event AND retrieve the result to account for both scenarios in which the results may already be available or be posted at a later point in time
    nativeEventEmitter.addListener(INIT_SESSION_EVENT, this._onReceivedInitSessionResult);

    this._getInitSessionResult((result) => {
      if(!result) { //Not available yet => will come through with the initSessionFinished event
        return;
      }

      this._onReceivedInitSessionResult(result);
    });
    this._patientInitSessionObservers = [];
  };

  _onReceivedInitSessionResult = (result) => {
    this._initSessionResult = result;

    this._patientInitSessionObservers.forEach((cb) => cb(result));
    if (this._isNewResult(result)) this._listeners.forEach(cb => cb(result));

    this._lastParams = result.params;
    this._patientInitSessionObservers = [];
  };

  // filter duplicate results (as observed in android. further investigation required) [rt2zz]
  _isNewResult = ({params}) => {
    return (this._lastParams['~id'] !== params['~id'] || this._lastParams['+click_timestamp'] !== params['+click_timestamp']);
  }

  _getInitSessionResult = (callback) => {
    RNBranch.getInitSessionResult(callback);
  };

  getInitSessionResultPatiently = (callback) => {
    if(this._initSessionResult) {
      return callback(this._initSessionResult);
    }

    this._patientInitSessionObservers.push(callback);
  };

  subscribe = (listener) => {
    this._listeners.push(listener);
    const unsubscribe = () => {
      let index = this._listeners.indexOf(listener);
      this._listeners.splice(index, 1);
    }
    return unsubscribe;
  };

  setDebug = () => {
    RNBranch.setDebug();
  };

  getLatestReferringParams = (callback) => {
    RNBranch.getLatestReferringParams(callback);
  };

  getFirstReferringParams = (callback) => {
    RNBranch.getFirstReferringParams(callback);
  };

  setIdentity = (identity) => {
    RNBranch.setIdentity(identity);
  };

  logout = () => {
    RNBranch.logout();
  };

  userCompletedAction = (event, state = {}) => {
    RNBranch.userCompletedAction(event, state);
  };

  showShareSheet = (shareOptions = {}, branchUniversalObject = {}, linkProperties = {}, callback = () => {}) => {
    shareOptions = {
      messageHeader: "Check this out!",
      messageBody: "Check this cool thing out: ",
      ...shareOptions,
    };
    branchUniversalObject = {
      canonicalIdentifier: "RNBranchSharedObjectId",
      contentTitle: "Cool Content!",
      contentDescription: "Cool Content Description",
      contentImageUrl: "",
      ...branchUniversalObject,
    };
    linkProperties = {
      feature: 'share',
      channel: 'RNApp',
      ...linkProperties,
    };

    RNBranch.showShareSheet(shareOptions, branchUniversalObject, linkProperties, ({channel, completed, error}) => callback({channel, completed, error}));
  };

  getShortUrl = () => {
    return RNBranch.getShortUrl();
  };
}

module.exports = new Branch();
