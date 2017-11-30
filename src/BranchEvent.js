import { NativeModules } from 'react-native'
const { RNBranch } = NativeModules

export default class BranchEvent {
  name = null
  params = {}
  contentItems = []

  constructor(name, contentItems = [], params = {}) {
    this.name = name
    this.params = params
    if (Array.isArray(contentItems)) {
      this.contentItems = contentItems
    }
    else {
      this.contentItems = [contentItems]
    }
  }

  async logEvent() {
    const idents = this.contentItems.map((b) => b.ident)
    return await RNBranch.logEventWithUniversalObjects(idents, this.name, this.params)
  }
}

// Commerce events

BranchEvent.AddToCart = RNBranch.STANDARD_EVENT_ADD_TO_CART
BranchEvent.AddToWishlist = RNBranch.STANDARD_EVENT_ADD_TO_WISHLIST
BranchEvent.ViewCart = RNBranch.STANDARD_EVENT_VIEW_CART
BranchEvent.InitiatePurchase = RNBranch.STANDARD_EVENT_INITIATE_PURCHASE
BranchEvent.AddPaymentInfo = RNBranch.STANDARD_EVENT_ADD_PAYMENT_INFO
BranchEvent.Purchase = RNBranch.STANDARD_EVENT_PURCHASE
BranchEvent.SpendCredits = RNBranch.STANDARD_EVENT_SPEND_CREDITS

// Content events

BranchEvent.Search = RNBranch.STANDARD_EVENT_SEARCH
BranchEvent.ViewItem = RNBranch.STANDARD_EVENT_VIEW_ITEM
BranchEvent.ViewItems = RNBranch.STANDARD_EVENT_VIEW_ITEMS
BranchEvent.Rate = RNBranch.STANDARD_EVENT_RATE
BranchEvent.Share = RNBranch.STANDARD_EVENT_SHARE

// User Lifecycle Events

BranchEvent.CompleteRegistration = RNBranch.STANDARD_EVENT_COMPLETE_REGISTRATION
BranchEvent.CompleteTutorial = RNBranch.STANDARD_EVENT_COMPLETE_TUTORIAL
BranchEvent.AchieveLevel = RNBranch.STANDARD_EVENT_ACHIEVE_LEVEL
BranchEvent.UnlockAchievement = RNBranch.STANDARD_EVENT_UNLOCK_ACHIEVEMENT
