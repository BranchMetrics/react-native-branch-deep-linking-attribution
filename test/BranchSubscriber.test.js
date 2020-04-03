import BranchSubscriber from '../src/BranchSubscriber'

test('BranchSubscriber default initializes with no options', () => {
  const subscriber = new BranchSubscriber(null)
  expect(typeof subscriber.options).toBe('object')
})
