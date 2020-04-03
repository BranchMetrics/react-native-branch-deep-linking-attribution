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

test('subscribes to init session start events', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false,
    onOpenStart: ({uri}) => {},
  })
  subscriber._nativeEventEmitter.addListener = jest.fn((eventType, listener) => {})
  subscriber.subscribe()

  expect(subscriber._nativeEventEmitter.addListener.mock.calls.length).toBe(1)
  expect(subscriber._nativeEventEmitter.addListener.mock.calls[0][0]).toBe(RNBranch.INIT_SESSION_START)
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
})
