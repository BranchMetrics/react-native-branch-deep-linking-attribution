import { NativeModules } from 'react-native'

NativeModules.RNBranch = {
  INIT_SESSION_START: 'RNBranch.initSessionStart',
  INIT_SESSION_SUCCESS: 'RNBranch.initSessionSuccess',
  INIT_SESSION_ERROR: 'RNBranch.initSessionError',

  STANDARD_EVENT_ADD_TO_CART: 'ADD_TO_CART',
  STANDARD_EVENT_ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  STANDARD_EVENT_VIEW_CART: 'VIEW_CART',
  STANDARD_EVENT_INITIATE_PURCHASE: 'INITIATE_PURCHASE',
  STANDARD_EVENT_ADD_PAYMENT_INFO: 'ADD_PAYMENT_INFO',
  STANDARD_EVENT_PURCHASE: 'PURCHASE',
  STANDARD_EVENT_SPEND_CREDITS: 'SPEND_CREDITS',

  STANDARD_EVENT_SEARCH: 'SEARCH',
  STANDARD_EVENT_VIEW_ITEM: 'VIEW_ITEM',
  STANDARD_EVENT_VIEW_ITEMS: 'VIEW_ITEMS',
  STANDARD_EVENT_RATE: 'RATE',
  STANDARD_EVENT_SHARE: 'SHARE',

  STANDARD_EVENT_COMPLETE_REGISTRATION: 'COMPLETE_REGISTRATION',
  STANDARD_EVENT_COMPLETE_TUTORIAL: 'COMPLETE_TUTORIAL',
  STANDARD_EVENT_ACHIEVE_LEVEL: 'ACHIEVE_LEVEL',
  STANDARD_EVENT_UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',

  redeemInitSessionResult: jest.fn(() => Promise.resolve({
    params: {
      '+clicked_branch_link': false,
      '+is_first_session': false,
    },
    error: null,
    uri: null,
  })),
}

NativeModules.RNBranchEventEmitter = {
  addListener: jest.fn(eventType => {}),
  removeListener: jest.fn(count => {}),
}
