# Branch Metrics React Native SDK Reference

[![build status](https://img.shields.io/travis/BranchMetrics/react-native-branch-deep-linking.svg?style=flat-square)](https://travis-ci.org/BranchMetrics/react-native-branch-deep-linking)
[![npm version](https://img.shields.io/npm/v/react-native-branch.svg?style=flat-square)](https://www.npmjs.com/package/react-native-branch)
[![npm downloads](https://img.shields.io/npm/dm/react-native-branch.svg?style=flat-square)](https://www.npmjs.com/package/react-native-branch)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)

This is a repository of our open source React Native SDK. Huge shoutout to our friends at [Dispatcher, Inc.](https://dispatchertrucking.com) for their help in compiling the initial version of this SDK. This SDK will help you handle iOS Universal Links, Android App Links and deferred deep links, do install attribution and much more!

## 2.0.0 beta

[Release 2.0.0]: ./docs/Release-2.0.0.md

Version 2.0.0-beta.3 is now available in NPM with a simplified SDK integration process. See [Release 2.0.0] for details.

**v1.1.0** The `createBranchUniversalObject` method is now async, so be sure to use `await` or handle the promise resolution, e.g.
```js
let buo = await branch.createBranchUniversalObject(...)
```
or
```js
branch.createBranchUniversalObject(...).then((buo) => {
  this.buo = buo
})
```
This method does not throw.

**react-native v0.40 support** is available in version 1.x. This is a non-backwards compatible update. If you need to stay on react-native <0.40 please fix your package.json version to react-native-branch@0.9. See [Updating to 1.0.0](./docs/updating-1.0.0.md) for details. Note that some build steps differ between 0.9 and 1.x. These are highlighted
where applicable.

**v0.8.0** If you have overridden `onStop` in MainActivity.java be sure *not* to invoke `RNBranchModule.onStop()`.

## Installation

For beta version 2.0.0 see [Release 2.0.0]. These instructions are for 0.9 and 1.x.

1. `npm install --save react-native-branch`
2. `react-native link react-native-branch` **or** link the project [manually](./docs/installation.md#manual-linking)
3. Add `pod 'Branch'` to your ios/Podfile ([details](./docs/installation.md#cocoa-pods))
4. `cd ios; pod install --repo-update`
5. Follow the [setup instructions](./docs/setup.md)

Note that CocoaPods 1.x no longer automatically updates pod repositories automatically on `pod install`. To make sure
you get the latest version of the Branch SDK, use `--repo-update` or run `pod repo update` before `pod install`.

If you are new to react-native or CocoaPods, read below for more details:
- [Full Installation Instructions](./docs/installation.md)
- [If you already have React in your Podfile](./docs/installation.md#pod-only-installation)
- [If you do not know what a Podfile is](./docs/installation.md#creating-a-new-podfile)

### Carthage
[Carthage]: https://github.com/Carthage/Carthage

If you would prefer to use [Carthage], you can skip steps 3 & 4 above and instead add the following to your `Cartfile`:

`github "BranchMetrics/ios-branch-deep-linking"`

Then run:

`carthage update`

If you're unfamiliar with how to add a framework to your project with [Carthage], you can [learn more here](https://github.com/Carthage/Carthage#adding-frameworks-to-an-application). You will need to maually link the framework by adding it to the "Linked Frameworks and Libraries" section of your target settings, and copy it by adding it to the "Input Files" section of your `carthage copy-frameworks` build phase.

## Next Steps
In order to get full Branch support you will need to setup your ios and android projects accordingly:
- [iOS](./docs/setup.md#ios)
- [Android](./docs/setup.md#android)

Please see the Branch [SDK Integration Guide](https://dev.branch.io/getting-started/sdk-integration-guide/) for complete setup instructions.

## Additional Resources
- [SDK Integration guide](https://dev.branch.io/recipes/add_the_sdk/react/)
- [Testing](https://dev.branch.io/getting-started/integration-testing/guide/react/)
- [Support portal, FAQ](http://support.branch.io/)

## Usage
```js
import branch, {
  AddToCartEvent,
  AddToWishlistEvent,
  PurchasedEvent,
  PurchaseInitiatedEvent,
  RegisterViewEvent,
  ShareCompletedEvent,
  ShareInitiatedEvent
} from 'react-native-branch'

// Subscribe to incoming links (both Branch & non-Branch)
// bundle = object with: {params, error, uri}
branch.subscribe((bundle) => {
  if (bundle && bundle.params && !bundle.error) {
  	// grab deep link data and route appropriately.
  }
})

let lastParams = await branch.getLatestReferringParams() // params from last open
let installParams = await branch.getFirstReferringParams() // params from original install
branch.setIdentity('theUserId')
branch.userCompletedAction('Purchased Item', {item: 123})
branch.logout()

let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
  automaticallyListOnSpotlight: true,
  metadata: {prop1: 'test', prop2: 'abc'},
  title: 'Cool Content!',
  contentDescription: 'Cool Content Description'})
branchUniversalObject.userCompletedAction(RegisterViewEvent)
branchUniversalObject.userCompletedAction('Custom Action', { key: 'value' })

let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
let linkProperties = { feature: 'share', channel: 'RNApp' }
let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
let spotlightResult = await branchUniversalObject.listOnSpotlight()

// optional: release native resources right away when finished with this BUO.
branchUniversalObject.release()

let rewards = await branch.loadRewards()
let redeemResult = await branch.redeemRewards(amount, bucket)
let creditHistory = await branch.getCreditHistory()
```

## Linking
###### <a id='subscribe'></a>[subscribe(listener)](#subscribe)
**listener** (function)  
Adds a change listener. Listener takes 1 argument with the shape `{ params, uri, error}`. The listener will be called for all incoming links. Branch links will have [params](#params), plain deep links will only have a uri.  

###### <a id='getlatestreferringparams'></a>[getLatestReferringParams(): Promise](#getlatestreferringparams)
Returns a promise that resolves to the most recent referring [params](#params). Because params come in asynchronously, in most cases it is better to use the `subscribe` method to receive the params as soon as they are available.

###### <a id='getfirstreferringparams'></a>[getFirstReferringParams(): Promise](#getfirstreferringparams)
Returns a promise to resolves with the first install referring [params](#params).

###### <a id='params'></a>[params object](#params)  
The params object is returned by various linking methods including subscribe, getLatestReferringParams, and getFirstReferringParams. Params will contain any data associated with the Branch link that was clicked before the app session began.  

Branch returns explicit parameters every time. Here is a list, and a description of what each represents.  
* `~` denotes analytics  
* `+` denotes information added by Branch

| **Parameter** | **Meaning**
| --- | ---
| ~channel | The channel on which the link was shared, specified at link creation time
| ~feature | The feature, such as `invite` or `share`, specified at link creation time
| ~tags | Any tags, specified at link creation time
| ~campaign | The campaign the link is associated with, specified at link creation time
| ~stage | The stage, specified at link creation time
| ~creation_source | Where the link was created ('API', 'Dashboard', 'SDK', 'iOS SDK', 'Android SDK', or 'Web SDK')
| ~referring_link | The referring link that drove the install/open, if present
| ~id | Automatically generated 18 digit ID number for the link that drove the install/open, if present
| +match_guaranteed | True or false as to whether the match was made with 100% accuracy
| +referrer | The referrer for the link click, if a link was clicked
| +phone_number | The phone number of the user, if the user texted himself/herself the app
| +is_first_session | Denotes whether this is the first session (install) or any other session (open)
| +clicked_branch_link | Denotes whether or not the user clicked a Branch link that triggered this session
| +click_timestamp | Epoch timestamp of when the click occurred
| +url | The full URL of the link that drove the install/open, if present (e.g. bnc.lt/m/abcde12345)

See also [Deep Link Routing](https://dev.branch.io/getting-started/deep-link-routing/guide/react/#branch-provided-data-parameters-in-callback)
on the Branch documentation site for more information.

Any additional data attached to the Branch link will be available unprefixed.

## User Methods
###### <a id='setidentity'></a>[setIdentity(userId)](#setidentity)
Set an identifier for the current user.

###### <a id='logout'></a>[logout(userId)](#logout)
Logout the current user.  

###### <a id='usercompletedaction'></a>[userCompletedAction(label, payload)](#usercompletedaction)
Register a user action with Branch.  

## Branch Universal Object
###### <a id='createbranchuniversalobject'></a>[createBranchUniversalObject(canonicalIdentifier, universalObjectOptions): Promise](#createbranchuniversalobject)
Create a branch universal object.  
**canonicalIdentifier** the unique identifier for the content.  
**universalObjectOptions** options for universal object as defined [below](#universalobjectoptions).  
Returns a promise. On resolution, the promise returns an object with methods `generateShortUrl`, `registerView`, `listOnSpotlight`, `showShareSheet`, `userCompletedAction` (v1.1.0) and `release` (v1.1.0). This method does not throw.

##### The following methods are available on the resulting branchUniversalObject:

###### <a id='usercompletedaction'></a>[- userCompletedAction(event, state = {}): null](#usercompletedaction)

_Introduced in version 1.1.0_

Report a user action for this Branch Universal Object instance. Create a Branch Universal Object on page load and call `userCompletedAction(RegisterViewEvent)`.

**event** an event name string, either one of the standard events defined by the SDK (as defined [below](#useractions)) or a custom event name.  
**state** an optional object with string properties representing custom application state

Returns null.

###### <a id='showsharesheet'></a>[- showShareSheet(shareOptions, linkProperties, controlParams): object](#showsharesheet)
**shareOptions** as defined [below](#shareoptions)  
**linkProperties** as defined [below](#linkproperties)  
**controlParams** as defined [below](#controlparams)  
Returns an object with `{ channel, completed, error }`  

######  <a id='generateshorturl'></a>[- generateShortUrl(linkProperties, controlParams): object](#generateshorturl)
**linkProperties** as defined [below](#linkproperties)  
**controlParams** as defined [below](#controlparams)  
Returns an object with `{ url }`  

######  <a id='registerview'></a>[- registerView()](#registerview)
Register a view for this universal object. **Deprecated**: Use `userCompletedAction(RegisterViewEvent)` instead.

######  <a id='listonspotlight'></a>[- listOnSpotlight()](#listonspotlight)
List the universal object on Spotlight (iOS only). **Note**: The recommended way to list an item on Spotlight is to use the `automaticallyListOnSpotlight` property with `createBranchUniversalObject` and then call `userCompletedAction(RegisterViewEvent)`, e.g.

```js
import branch, { RegisterViewEvent } from 'react-native-branch'

let universalObject = await branch.createBranchUniversalObject('abc', {
  automaticallyListOnSpotlight: true,
  title: 'Item title',
  contentDescription: 'Item description',
  contentImageUrl: 'https://example.com/image.png'
})
universalObject.userCompletedAction(RegisterViewEvent)
```

The `automaticallyListOnSpotlight` property is ignored on Android.

##### <a id='release'></a>[- release()](#release)
_Introduced in version 1.1.0_

(Optional) Immediately release native resources used by this Branch Universal Object instance. Those resources will eventually be removed if they are unused for some time, but you can also call `release()` when a BUO is no longer used, e.g. in `componentWillUnmount()`. (See the [example apps](./examples) in this repo.)

##### <a id='useractions'></a>[Register User Actions On An Object](#useractions)

We've added a series of custom events that you'll want to start tracking for rich analytics and targeting. Here's a list below with a sample snippet that calls the register view event.

| Event | Description
| ----- | ---
| RegisterViewEvent | User viewed the object
| AddToWishlistEvent | User added the object to their wishlist
| AddToCartEvent | User added object to cart
| PurchaseInitiatedEvent | User started to check out
| PurchasedEvent | User purchased the item
| ShareInitiatedEvent | User started to share the object
| ShareCompletedEvent | User completed a share

```js
import branch, { RegisterViewEvent } from 'react-native-branch'
let universalObject = await branch.createUniversalObject('abc', {})
universalObject.userCompletedAction(RegisterViewEvent)
```

Note that `registerView()` is deprecated in favor of `userCompletedAction(RegisterViewEvent)`.

###### <a id='universalobjectoptions'></a>[universalObjectOptions object](#universalobjectoptions)
An object of options for the branchUniversalObject.  

|         Key                  | TYPE   |             DESCRIPTION                                |
| ---------------------------- | ------ | ------------------------------------------------------ |
| automaticallyListOnSpotlight | Bool   | List this item on Spotlight (iOS). Ignored on Android. |
| canonicalIdentifier          | String | The object identifier                                  |
| contentDescription           | String | Object Description                                     |
| contentImageUrl              | String | The Image URL                                          |
| contentIndexingMode          | String | Indexing Mode 'private' or 'public'                    |
| currency                     | String | A 3-letter ISO currency code (used with price)         |
| expirationDate               | String | A UTC expiration date, e.g. 2018-02-01T00:00:00        |
| keywords                     | Array  | An array of keyword strings                            |
| metadata                     | Object | Custom key/value                                       |
| price                        | Float  | A floating-point price (used with currency)            |
| title                        | String | The object title                                       |
| type                         | String | MIME type for this content                             |

###### <a id='linkproperties'></a>[linkProperties object](#linkproperties)
An object of link properties.  

|    KEY   |   TYPE   |          MEANING
| -------- | -------- |------------------------
| alias    | `string` | Specify a link alias in place of the standard encoded short URL (e.g., `[branchsubdomain]/youralias or yourdomain.co/youralias)`. Link aliases are unique, immutable objects that cannot be deleted. **Aliases on the legacy `bnc.lt` domain are incompatible with Universal Links and Spotlight**
| campaign | `string` | Use this field to organize the links by actual campaign. For example, if you launched a new feature or product and want to run a campaign around that
| channel  | `string` | Use channel to tag the route that your link reaches users. For example, tag links with ‘Facebook’ or ‘LinkedIn’ to help track clicks and installs through those paths separately
| feature  | `string` | This is the feature of your app that the link might be associated with. eg: if you had built a referral program, you would label links with the feature `referral`
| stage    | `string` | Use this to categorize the progress or category of a user when the link was generated. For example, if you had an invite system accessible on level 1, level 3 and 5, you could differentiate links generated at each level with this parameter
| tags     | `array`  | This is a free form entry with unlimited values. Use it to organize your link data with labels that don’t fit within the bounds of the above

###### <a id='controlparams'></a>[controlParams object](#controlparams)
Control parameters for the link. All Branch control parameters are supported. See [here](https://dev.branch.io/getting-started/configuring-links/guide/#link-control-parameters) for a complete list. In particular, these control parameters determine where the link redirects.

|        KEY         |   TYPE   |       MEANING
| ------------------ | -------- | --------------------
| $fallback_url      | `string` | Change the redirect endpoint for all platforms - so you don’t have to enable it by platform
| $desktop_url       | `string` | Change the redirect endpoint on desktops  
| $android_url       | `string` | Change the redirect endpoint for Android
| $ios_url           | `string` | Change the redirect endpoint for iOS
| $ipad_url          | `string` | Change the redirect endpoint for iPads
| $fire_url          | `string` | Change the redirect endpoint for Amazon Fire OS
| $blackberry_url    | `string` | Change the redirect endpoint for Blackberry OS
| $windows_phone_url | `string` | Change the redirect endpoint for Windows OS

###### <a id='shareoptions'></a>[shareOptions object](#shareoptions)  

|        KEY         |   TYPE   |       MEANING
| ------------------ | -------- | --------------------
| messageHeader      | `string` | The header text
| messageBody        | `string` | The body text
| emailSubject       | `string` | The subject of the email channel if selected

## Referral Methods
######  <a id='loadrewards'></a>[loadRewards()](#loadrewards)
Load rewards.

######  <a id='redeemrewards'></a>[redeemRewards(amount, bucket)](#redeemrewards)
Redeem rewards.
**amount** the amount to redeem  
**bucket** (optional) the bucket to redeem from.  

######  <a id='getcredithistory'></a>[getCreditHistory(): array](#getcredithistory)
Get the credit history as an array.
