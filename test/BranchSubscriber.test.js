import { BranchSubscriber } from 'react-native-branch'

test('BranchSubscriber default initializes with no options', () => {
  const subscriber = new BranchSubscriber(null)
  expect(typeof subscriber.options).toBe('object')
})

test('BranchSubscriber stores options passed to the constructor', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false
  })

  expect(typeof subscriber.options).toBe('object')
  expect('checkCachedEvents' in subscriber.options).toBe(true)
  expect(subscriber.options.checkCachedEvents).toBe(false)
})
