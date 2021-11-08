import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'

const { RNBranch, RNBranchEventEmitter } = NativeModules

/**
 * Utility class to encapsulate the logic of subscription to native events.
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
   * Tracks whether cached events should be checked on the next
   * call to subscribe(). Initialized by options.checkCachedEvents
   * if present, true otherwise.
   */
  _checkCachedEvents = true

  /**
   * Keep track of whether subscription is active.
   */
  _subscribed = false

  /**
   * The options Object passed to the constructor
   * @type {Object}
   */
  options = {}

  /**
   * Creates a new BranchSubscriber object with options.
   *
   * @param {!Object} options an Object containing options
   */
  constructor(options) {
    this.options = options || {}
    if ('checkCachedEvents' in this.options) {
      this._checkCachedEvents = this.options.checkCachedEvents
    }
  }

  subscribe() {
    if (this._subscribed) return

    this._subscribed = true

    if (this._checkCachedEvents) {
      /*
       * Only check for events from the native layer on the first call to
       * subscribe().
       */
      this._checkCachedEvents = false
      RNBranch.redeemInitSessionResult().then((result) => {
        if (result) {
          /*** Cached value is returned, so set it as cached. ***/
          if('params' in result && !!result['params']) {
            result['params']['+rn_cached_initial_event'] = true
          }

          /*
           * TODO: There can easily be a race here on cold launch from a link.
           * An INIT_SESSION_START event can be emitted by the native layer
           * before the subscribe() method is called in JS. Then subscribe() is
           * called before a cached response is available, so here we get
           * result == null. Then the live INIT_SESSION_SUCCESS event is
           * transmitted to JS, and onOpenComplete is called with a non-null
           * URI, but onOpenStart was never called. This can be addressed
           * by caching the pending URI in the native layers.
           */
          if (this.options.onOpenStart && 'uri' in result) {
            this.options.onOpenStart({uri: result.uri, cachedInitialEvent: true})
          }
          if (this.options.onOpenComplete) {
            // result includes uri and +rn_cached_initial_event.
            this.options.onOpenComplete(result)
          }
        }

        this._subscribe()
      })
    }
    else {
      this._subscribe()
    }
  }

  /**
   * Activates subscription to native events. Private. Use
   * subscribe() and set checkCachedEvents true or false in
   * constructor.
   */
  _subscribe() {
    if (this.options.onOpenStart) {
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_START, this.options.onOpenStart)
    }

    if (this.options.onOpenComplete) {
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_SUCCESS, this.options.onOpenComplete)
      this._nativeEventEmitter.addListener(RNBranch.INIT_SESSION_ERROR, this.options.onOpenComplete)
    }
  }

  /**
   * Deactivates subscription to native events
   */
  unsubscribe() {
    if (!this._subscribed) return

    this._subscribed = false

    if (this.options.onOpenStart) {
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_START, this.options.onOpenStart)
    }

    if (this.options.onOpenComplete) {
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_SUCCESS, this.options.onOpenComplete)
      this._nativeEventEmitter.removeListener(RNBranch.INIT_SESSION_ERROR, this.options.onOpenComplete)
    }
  }
}
