import { BranchSubscriber } from 'react-native-branch'

test('BranchSubscriber default initializes with no options', () => {
  const subscriber = new BranchSubscriber(null)
  expect(subscriber.options).toEqual({})
})

test('BranchSubscriber stores options passed to the constructor', () => {
  const subscriber = new BranchSubscriber({
    checkCachedEvents: false
  })

  expect(subscriber.options).toEqual({ checkCachedEvents: false })
})
