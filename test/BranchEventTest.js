import test from 'ava'
import React from 'react-native'
const { RNBranch } = React.NativeModules

import { BranchEvent } from '../src/index.js'

// --- Constant mapping ---

test('AddToCart is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_ADD_TO_CART, BranchEvent.AddToCart)
})

test('AddToWishlist is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_ADD_TO_WISHLIST, BranchEvent.AddToWishlist)
})

test('ViewCart is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_VIEW_CART, BranchEvent.ViewCart)
})

test('InitiatePurchase is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_INITIATE_PURCHASE, BranchEvent.InitiatePurchase)
})

test('AddPaymentInfo is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_ADD_PAYMENT_INFO, BranchEvent.AddPaymentInfo)
})

test('Purchase is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_PURCHASE, BranchEvent.Purchase)
})

test('SpendCredits is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_SPEND_CREDITS, BranchEvent.SpendCredits)
})

test('Search is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_SEARCH, BranchEvent.Search)
})

test('ViewItem is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_VIEW_ITEM, BranchEvent.ViewItem)
})

test('ViewItems is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_VIEW_ITEMS, BranchEvent.ViewItems)
})

test('Rate is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_RATE, BranchEvent.Rate)
})

test('Share is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_SHARE, BranchEvent.Share)
})

test('CompleteRegistration is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_COMPLETE_REGISTRATION, BranchEvent.CompleteRegistration)
})

test('CompleteTutorial is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_COMPLETE_TUTORIAL, BranchEvent.CompleteTutorial)
})

test('AchieveLevel is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_ACHIEVE_LEVEL, BranchEvent.AchieveLevel)
})

test('UnlockAchievement is correct', t => {
  t.is(RNBranch.STANDARD_EVENT_UNLOCK_ACHIEVEMENT, BranchEvent.UnlockAchievement)
})

// --- Field mapping

test('Name mapping is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem)
  t.is(event.name, BranchEvent.ViewItem)
})

test('contentItems empty when null passed', t => {
  const event = new BranchEvent(BranchEvent.ViewItem)
  t.true(Array.isArray(event.contentItems))
  t.is(0, event.contentItems.length)
})

test('contentItems contains one item when one passed', t => {
  const item = {}
  const event = new BranchEvent(BranchEvent.ViewItem, item)
  t.true(Array.isArray(event.contentItems))
  t.is(1, event.contentItems.length)
  t.is(item, event.contentItems[0])
})

test('contentItems contains all items when an array passed', t => {
  const item1 = { name: 'item1' }
  const item2 = { name: 'item2' }
  const event = new BranchEvent(BranchEvent.ViewItem, [item1, item2])
  t.true(Array.isArray(event.contentItems))
  t.is(2, event.contentItems.length)
  t.is(item1, event.contentItems[0])
  t.is(item2, event.contentItems[1])
})

test('transactionID is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).transactionID)
})

test('transactionID is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { transactionID: 'transactionID' })
  t.is('transactionID', event.transactionID)
})

test('currency is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).currency)
})

test('currency is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { currency: 'USD' })
  t.is('USD', event.currency)
})

test('revenue is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).revenue)
})

test('revenue is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { revenue: '20.00' })
  t.is('20.00', event.revenue)
})

test('shipping is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).shipping)
})

test('shipping is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { shipping: '2.00' })
  t.is('2.00', event.shipping)
})

test('tax is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).tax)
})

test('tax is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { tax: '1.60' })
  t.is('1.60', event.tax)
})

test('coupon is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).coupon)
})

test('coupon is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { coupon: 'coupon code' })
  t.is('coupon code', event.coupon)
})

test('affiliation is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).affiliation)
})

test('affiliation is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { affiliation: 'affiliation' })
  t.is('affiliation', event.affiliation)
})

test('description is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).description)
})

test('description is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { description: 'description' })
  t.is('description', event.description)
})

test('searchQuery is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).searchQuery)
})

test('searchQuery is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { searchQuery: 'searchQuery' })
  t.is('searchQuery', event.searchQuery)
})

test('customData is null by default', t => {
  t.is(null, new BranchEvent(BranchEvent.ViewItem).customData)
})

test('customData is correct', t => {
  const event = new BranchEvent(BranchEvent.ViewItem, null, { customData: { key: 'value' } })
  t.is('object', typeof(event.customData))
  t.is('value', event.customData.key)
})

// --- _identFromMessage

test('_identFromMessage parses a UUID from text', t => {
  const event = new BranchEvent('Name')
  const message = 'BranchUniversalObject not found for ident 16432373-05cb-4b42-85a0-55599e28c515.'
  t.is('16432373-05cb-4b42-85a0-55599e28c515', event._identFromMessage(message))
})
