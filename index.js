var { NativeModules, NativeAppEventEmitter } = require('react-native');

var rnBranch = NativeModules.RNBranch;

class Branch {
  constructor() {
    //We listen to the initialization event AND retrieve the result to account for both scenarios in which the results may already be available or be posted at a later point in time
    NativeAppEventEmitter.addListener('RNBranch.initSessionFinished', this._onReceivedInitSessionResult);
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

    this._patientInitSessionObservers.forEach((cb) => {
      cb(result);
    });
    this._patientInitSessionObservers = [];
  };

  _getInitSessionResult = (callback) => {    
    rnBranch.getInitSessionResult(callback);
  };

  getInitSessionResultPatiently = (callback) => {
    if(this._initSessionResult) {
      return callback(this._initSessionResult);
    }

    this._patientInitSessionObservers.push(callback);
  };

  setDebug = () => {
    rnBranch.setDebug();
  };

  getLatestReferringParams = (callback) => {
    rnBranch.getLatestReferringParams(callback);
  };

  getFirstReferringParams = (callback) => {
    rnBranch.getFirstReferringParams(callback);
  };

  setIdentity = (identity) => {
    rnBranch.setIdentity(identity);
  };

  logout = () => {
    rnBranch.logout();
  };

  userCompletedAction = (event, state = {}) => {
    rnBranch.userCompletedAction(event, state);
  };
}

export default new Branch();