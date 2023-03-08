import { NativeModules } from 'react-native'
const { RNBranch } = NativeModules
import { BranchEvent } from 'react-native-branch'

// --- Constant mapping ---

test('AddToCart is correct', () => {
  expect(BranchEvent.AddToCart).toBe(RNBranch.STANDARD_EVENT_ADD_TO_CART)
})

test('AddToWishlist is correct', () => {
  expect(BranchEvent.AddToWishlist).toBe(RNBranch.STANDARD_EVENT_ADD_TO_WISHLIST)
})

test('ViewCart is correct', () => {
  expect(BranchEvent.ViewCart).toBe(RNBranch.STANDARD_EVENT_VIEW_CART)
})

test('InitiatePurchase is correct', () => {
  expect(BranchEvent.InitiatePurchase).toBe(RNBranch.STANDARD_EVENT_INITIATE_PURCHASE)
})

test('AddPaymentInfo is correct', () => {
  expect(BranchEvent.AddPaymentInfo).toBe(RNBranch.STANDARD_EVENT_ADD_PAYMENT_INFO)
})

test('Purchase is correct', () => {
  expect(BranchEvent.Purchase).toBe(RNBranch.STANDARD_EVENT_PURCHASE)
})

test('Search is correct', () => {
  expect(BranchEvent.Search).toBe(RNBranch.STANDARD_EVENT_SEARCH)
})

test('ViewItem is correct', () => {
  expect(BranchEvent.ViewItem).toBe(RNBranch.STANDARD_EVENT_VIEW_ITEM)
})

test('ViewItems is correct', () => {
  expect(BranchEvent.ViewItems).toBe(RNBranch.STANDARD_EVENT_VIEW_ITEMS)
})

test('Rate is correct', () => {
  expect(BranchEvent.Rate).toBe(RNBranch.STANDARD_EVENT_RATE)
})

test('Share is correct', () => {
  expect(BranchEvent.Share).toBe(RNBranch.STANDARD_EVENT_SHARE)
})

test('CompleteRegistration is correct', () => {
  expect(BranchEvent.CompleteRegistration).toBe(RNBranch.STANDARD_EVENT_COMPLETE_REGISTRATION)
})

test('CompleteTutorial is correct', () => {
  expect(BranchEvent.CompleteTutorial).toBe(RNBranch.STANDARD_EVENT_COMPLETE_TUTORIAL)
})

test('AchieveLevel is correct', () => {
  expect(BranchEvent.AchieveLevel).toBe(RNBranch.STANDARD_EVENT_ACHIEVE_LEVEL)
})

test('UnlockAchievement is correct', () => {
  expect(BranchEvent.UnlockAchievement).toBe(RNBranch.STANDARD_EVENT_UNLOCK_ACHIEVEMENT)
})

test('ViewAd is correct', () => {
  expect(BranchEvent.ViewAd).toBe(RNBranch.STANDARD_EVENT_VIEW_AD)
})

test('ClickAd is correct', () => {
  expect(BranchEvent.ClickAd).toBe(RNBranch.STANDARD_EVENT_CLICK_AD)
})

test('Invite is correct', () => {
  expect(BranchEvent.Invite).toBe(RNBranch.STANDARD_EVENT_INVITE)
})

test('Login is correct', () => {
  expect(BranchEvent.Login).toBe(RNBranch.STANDARD_EVENT_LOGIN)
})

test('Reserve is correct', () => {
  expect(BranchEvent.Reserve).toBe(RNBranch.STANDARD_EVENT_RESERVE)
})

test('Subscribe is correct', () => {
  expect(BranchEvent.Subscribe).toBe(RNBranch.STANDARD_EVENT_SUBSCRIBE)
})

test('StartTrial is correct', () => {
  expect(BranchEvent.StartTrial).toBe(RNBranch.STANDARD_EVENT_START_TRIAL)
})

// --- Field mapping

test('Name mapping is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem)
  expect(BranchEvent.ViewItem).toBe(event.name)
})

test('contentItems empty when null passed', () => {
  const event = new BranchEvent(BranchEvent.ViewItem)
  expect(Array.isArray(event.contentItems)).toBe(true)
  expect(event.contentItems.length).toBe(0)
})

test('contentItems contains one item when one passed', () => {
  const item = {}
  const event = new BranchEvent(BranchEvent.ViewItem, item)
  expect(Array.isArray(event.contentItems)).toBe(true)
  expect(event.contentItems.length).toBe(1)
  expect(event.contentItems[0]).toBe(item)
})

test('contentItems contains all items when an array passed', () => {
  const item1 = { name: 'item1' }
  const item2 = { name: 'item2' }
  const event = new BranchEvent(BranchEvent.ViewItem, [item1, item2])
  expect(Array.isArray(event.contentItems)).toBe(true)
  expect(event.contentItems.length).toBe(2)
  expect(event.contentItems[0]).toBe(item1)
  expect(event.contentItems[1]).toBe(item2)
})

test('transactionID is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).transactionID).toBe(null)
})

test('transactionID is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { transactionID: 'transactionID' })
  expect(event.transactionID).toBe('transactionID')
})

test('currency is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).currency).toBe(null)
})

test('currency is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { currency: 'USD' })
  expect(event.currency).toBe('USD')
})

test('revenue is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).revenue).toBe(null)
})

test('revenue is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { revenue: '20.00' })
  expect(event.revenue).toBe('20.00')
})

test('shipping is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).shipping).toBe(null)
})

test('shipping is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { shipping: '2.00' })
  expect(event.shipping).toBe('2.00')
})

test('tax is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).tax).toBe(null)
})

test('tax is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { tax: '1.60' })
  expect(event.tax).toBe('1.60')
})

test('coupon is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).coupon).toBe(null)
})

test('coupon is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { coupon: 'coupon code' })
  expect(event.coupon).toBe('coupon code')
})

test('affiliation is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).affiliation).toBe(null)
})

test('affiliation is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { affiliation: 'affiliation' })
  expect(event.affiliation).toBe('affiliation')
})

test('description is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).description).toBe(null)
})

test('description is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { description: 'description' })
  expect(event.description).toBe('description')
})

test('searchQuery is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).searchQuery).toBe(null)
})

test('searchQuery is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { searchQuery: 'searchQuery' })
  expect(event.searchQuery).toBe('searchQuery')
})

test('customData is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).customData).toBe(null)
})

test('customData is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { customData: { key: 'value' } })
  expect(typeof event.customData).toBe('object')
  expect(event.customData.key).toBe('value')
})

test('alias is null by default', () => {
  expect(new BranchEvent(BranchEvent.ViewItem).alias).toBe(null)
})

test('alias is correct', () => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { alias: 'My Alias' })
  expect(event.alias).toBe('My Alias')
})

// --- _identFromMessage

test('_identFromMessage parses a UUID from text', () => {
  const event = new BranchEvent('Name')
  const message = 'BranchUniversalObject not found for ident 16432373-05cb-4b42-85a0-55599e28c515.'
  expect(event._identFromMessage(message)).toBe('16432373-05cb-4b42-85a0-55599e28c515')
})
