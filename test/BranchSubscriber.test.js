import { NativeModules } from 'react-native'
const { RNBranch } = NativeModules
import { BranchSubscriber } from 'react-native-branch'

test('default initializes with no options', () => {
  const subscriber = new BranchSubscriber(null)
  expect(subscriber.options).toEqual({})
})

test('stores options passed to the constructor', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false
  })

  expect(subscriber.options).toEqual({ checkCachedEvents: false })
})

test('will check cached events by default', () => {
  const subscriber = new BranchSubscriber({})
  expect(subscriber.options.checkCachedEvents).toBe(undefined)
  expect(subscriber._checkCachedEvents).toBe(true)
})

test('subscribes to init session start events', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false,
    onOpenStart: ({uri}) => {},
  })
  subscriber._nativeEventEmitter.addListener = jest.fn((eventType, listener) => {})
  subscriber.subscribe()

  expect(subscriber._nativeEventEmitter.addListener.mock.calls.length).toBe(1)
  expect(subscriber._nativeEventEmitter.addListener.mock.calls[0][0]).toBe(RNBranch.INIT_SESSION_START)
  expect(subscriber._nativeEventEmitter.addListener.mock.calls[0][1]).toBe(subscriber.options.onOpenStart)
})

test('subscribes to init session success & error events', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false,
    onOpenComplete: ({params, error, uri}) => {},
  })
  subscriber._nativeEventEmitter.addListener = jest.fn((eventType, listener) => {})
  subscriber.subscribe()

  expect(subscriber._nativeEventEmitter.addListener.mock.calls.length).toBe(2)

  // This comparison ignores the call order.
  const mockArgs = subscriber._nativeEventEmitter.addListener.mock.calls.map(call => call[0]).sort()
  expect(mockArgs).toEqual([
    RNBranch.INIT_SESSION_ERROR,
    RNBranch.INIT_SESSION_SUCCESS,
  ])
  expect(subscriber._nativeEventEmitter.addListener.mock.calls[0][1]).toBe(subscriber.options.onOpenComplete)
  expect(subscriber._nativeEventEmitter.addListener.mock.calls[1][1]).toBe(subscriber.options.onOpenComplete)
})

// async test
test('will return a cached event when appropriate', done => {
  const mockResult = {
    params: {
      '+clicked_branch_link': false,
      '+is_first_session': false,
    },
    error: null,
    uri: null,
  }

  // expectedResult is mockResult with +rn_cached_initial_event added to
  // params.
  const expectedResult = {
    ...mockResult,
    params: {
      ...mockResult.params,
      '+rn_cached_initial_event': true,
    },
  }

  // Mock promise from redeemInitSessionResult
  RNBranch.redeemInitSessionResult.mockReturnValueOnce(Promise.resolve(mockResult))

  // Set up subscriber, mocking the callbacks
  const subscriber = new BranchSubscriber({
    checkCachedEvents: true,
    onOpenStart: jest.fn(({uri}) => {}),
    onOpenComplete: jest.fn(({params, error, uri}) => {}),
  })

  // mock subscriber._nativeEventEmitter.addListener. Expect this to be called three times.
  let addListenerCount = 0
  subscriber._nativeEventEmitter.addListener = (eventType, listener) => {
    if (++addListenerCount < 3) return

    // --- Check results ---

    try {
      // Expect onOpenStart and onOpenComplete both to be called

      // uri passed to onOpenStart
      expect(subscriber.options.onOpenStart.mock.calls.length).toBe(1)
      expect(subscriber.options.onOpenStart.mock.calls[0][0]).toEqual({uri: null, cachedInitialEvent: true})

      // full result passed to onOpenComplete with +rn_cached_initial_event: true
      expect(subscriber.options.onOpenComplete.mock.calls.length).toBe(1)
      const actualResult = subscriber.options.onOpenComplete.mock.calls[0][0]
      expect(actualResult).toEqual(expectedResult)

      // state cleared
      expect(subscriber._checkCachedEvents).toBe(false)

      done()
    } catch(error) {
      done(error)
    }
  }
  expect(subscriber._checkCachedEvents).toBe(true)

  // --- Code under test ---
  subscriber.subscribe()
})

test('passes a non-null uri to onOpenStart when available', done => {
  const mockResult = {
    params: {
      '+clicked_branch_link': true,
      '+is_first_session': false,
    },
    error: null,
    uri: 'https://abcd.app.link/xyz',
  }

  // Mock promise from redeemInitSessionResult
  RNBranch.redeemInitSessionResult.mockReturnValueOnce(Promise.resolve(mockResult))

  // Set up subscriber, mocking the callbacks
  const subscriber = new BranchSubscriber({
    checkCachedEvents: true,
    onOpenStart: jest.fn(({uri}) => {}),
  })

  // mock subscriber._nativeEventEmitter.addListener.
  subscriber._nativeEventEmitter.addListener = (eventType, listener) => {
    // --- Check results ---

    try {
      // Expect onOpenStart to be called
      // uri passed to onOpenStart
      expect(subscriber.options.onOpenStart.mock.calls.length).toBe(1)
      expect(subscriber.options.onOpenStart.mock.calls[0][0]).toEqual({uri: mockResult.uri, cachedInitialEvent: true})

      done()
    } catch(error) {
      done(error)
    }
  }

  // --- Code under test ---
  subscriber.subscribe()
})

test('does not return a cached result when none available', done => {
  // Mock promise from redeemInitSessionResult
  RNBranch.redeemInitSessionResult.mockReturnValueOnce(Promise.resolve(null))

  // Set up subscriber, mocking the callbacks
  const subscriber = new BranchSubscriber({
    checkCachedEvents: true,
    onOpenStart: jest.fn(({uri}) => {}),
    onOpenComplete: jest.fn(({params, error, uri}) => {}),
  })

  // mock subscriber._nativeEventEmitter.addListener. Expect this to be called three times.
  let addListenerCount = 0
  subscriber._nativeEventEmitter.addListener = (eventType, listener) => {
    if (++addListenerCount < 3) return

    // --- Check results ---

    try {
      // Expect onOpenStart, onOpenComplete not to be called
      expect(subscriber.options.onOpenStart.mock.calls.length).toBe(0)
      expect(subscriber.options.onOpenComplete.mock.calls.length).toBe(0)

      done()
    } catch(error) {
      done(error)
    }
  }

  // --- Code under test ---
  subscriber.subscribe()
})

/*
test('can unsubscribe after subscribe() is called', () => {
  // set up subscriber
  const subscriber = new BranchSubscriber({
    onOpenStart: jest.fn(({uri}) => {}),
    onOpenComplete: jest.fn(({params, error, uri}) => {}),
  })

  // subscription in effect (set by calling subscribe())
  subscriber._subscribed = true

  // mock removeListener call to native event emitter
  subscriber._nativeEventEmitter.removeListener = jest.fn((eventType, listener) => {})

  // --- Code under test ---
  subscriber.unsubscribe()

  // --- Check results ---

  expect(subscriber._nativeEventEmitter.removeListener.mock.calls.length).toBe(3)
  const mockArgs = subscriber._nativeEventEmitter.removeListener.mock.calls.map(call => call[0]).sort()
  expect(mockArgs).toEqual([
    RNBranch.INIT_SESSION_ERROR,
    RNBranch.INIT_SESSION_START,
    RNBranch.INIT_SESSION_SUCCESS,
  ])
})
*/
