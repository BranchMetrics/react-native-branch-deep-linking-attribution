import test from 'ava'
import React from 'react-native'
const { RNBranch } = React.NativeModules

import { BranchEvent } from '../src/index.js'

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
