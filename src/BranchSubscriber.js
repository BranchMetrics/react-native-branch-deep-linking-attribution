import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch, RNBranchEventEmitter } = NativeModules

/**
 * Class to encapsulate the logic of subscription to native events.
 */
export default class BranchSubscriber {
  /**
   * Native event emitter (private)
   */
  _nativeEventEmitter = Platform.select({
    android: DeviceEventEmitter,
    ios: new NativeEventEmitter(RNBranchEventEmitter),
  })

  /**
   * The options Object passed to the constructor
   * @type {Object}
   */
  options = {}

  /**
   * Creates a new BranchSubscribe object with options.
   *
   * @param {!Object} options an Object containing options
   */
  constructor(options) {
    this.options = options
  }

  /**
   * Activates subscription to native events
   */
  subscribe() {
    if (options.onOpenStart) {
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_START, options.onOpenStart)
    }

    if (options.onOpenComplete) {
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_SUCCESS, options.onOpenComplete)
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_ERROR, options.onOpenComplete)
    }
  }

  /**
   * Deactivates subscription to native events
   */
  unsubscribe() {
    if (options.onOpenStart) {
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_START, options.onOpenStart)
    }

    if (options.onOpenComplete) {
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_SUCCESS, options.onOpenComplete)
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_ERROR, options.onOpenComplete)
    }
  }
}
