# Branch Metrics React Native SDK Reference

This is a repository of our open source React Native SDK. Huge shoutout to our friends at [Dispatcher, Inc.](https://dispatchertrucking.com) for their help in compiling the initial version of this SDK.

## Installation

1. `npm install --save react-native-branch`
2. `rnpm link react-native-branch` **or** link the project [manually](./docs/installation.md#manual-linking)
3. Add `pod 'Branch'` to your ios/Podfile ([details](./docs/installation.md#cocoa-pods))
4. `cd ios && pod install`
5. Follow the [setup instructions](`./docs/setup.md`)

If you are new to react-native or cocoa-pods, read below for more details:
- [Full Installation Instructions](./docs/installation.md)
- [If you already have React in your Podfile](./docs/installation.md#pod-only-installation)
- [If you do not know what a Podfile is](./docs/installation.md#creating-a-new-podfile)

## Next Steps
In order to get full branch support you will need to setup your ios and android projects accordingly:
- [iOS](./docs/setup.md#ios)
- [android](./docs/setup.md#android)

Please see the branch [SDK Integration Guide](https://dev.branch.io/getting-started/sdk-integration-guide/) for complete setup instructions.

## Additional Resources
- [SDK Integration guide](https://dev.branch.io/recipes/add_the_sdk/react/)
- [Testing](https://dev.branch.io/getting-started/integration-testing/guide/react/)
- [Support portal, FAQ](http://support.branch.io/)

## Usage
```js
import branch from 'react-native-branch'

// Subscribe to incoming links (both branch & non-branch)
branch.subscribe(({params, error, uri}) => {
  if (params) { /* handle branch link */ }
  else { /* handle uri */ }
})

let lastParams = await branch.getLatestReferringParams() // params from last open
let installParams = await branch.getFirstReferringParams() // params from original install
branch.setIdentity('theUserId')
branch.userCompletedAction('Purchased Item', {item: 123})
branch.logout()

let branchUniversalObject = branch.createBranchUniversalObject('canonicalIdentifier', {metadata: {prop1: 'test', prop2: 'abc'}, contentTitle: 'Cool Content!', contentDescription: 'Cool Content Description'}

let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
let linkProperties = { feature: 'share', channel: 'RNApp' }
let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
let viewResult = await branchUniversalObject.registerView()
let spotlightResult = await branchUniversalObject.listOnSpotlight()

let rewards = await branch.loadRewards()
let redeemResult = await branch.redeemRewards(amount, bucket)
let creditHistory = await branch.getCreditHistory()
```

## Linking
###### <a id='params'></a>[`params object`](#params)
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
| +match_guaranteed | True or false as to whether the match was made with 100% accuracy
| +referrer | The referrer for the link click, if a link was clicked
| +phone_number | The phone number of the user, if the user texted himself/herself the app
| +is_first_session | Denotes whether this is the first session (install) or any other session (open)
| +clicked_branch_link | Denotes whether or not the user clicked a Branch link that triggered this session
| +click_timestamp | Epoch timestamp of when the click occurred
Any additional data attached to the branch link will be available unprefixed.

###### <a id='subscribe'></a>[`subscribe(listener)`](#subscribe)
**listener** (function)
Adds a change listener. Listener takes 1 argument with the shape `{ params, uri, error}`. The listener will be called for all incoming links. Branch links will have params, plain deep links will only have a uri.

###### <a id='getlatestreferringparams'></a>[`getLatestReferringParams(): Promise`](#getlatestreferringparams)
Returns a promise that resolves to the most recent referring parameters. Because params come in asynchronously, in most cases it is better to use the `subscribe` method to receive the params as soon as they are available.
###### <a id='getfirstreferringparams'></a>[`getFirstReferringParams(): Promise`](#getfirstreferringparams)
Returns a promise to resolves with the first install referring params.

## User Methods
###### <a id='setidentity'></a>[`setIdentity(userId)`](#setidentity)
Set an identifier for the current user.

###### <a id='logout'></a>[`logout(userId)`](#logout)
Logout the current user.

###### <a id='usercompletedaction'></a>[`userCompletedAction(label, payload)`](#usercompletedaction)
Register a user action with branch.

## Branch Universal Object
###### <a id='universalobjectoptions'></a>[`universalObjectOptions object`](#universalobjectoptions)
An object of options for the branchUniversalObject.
`{metadata: {prop1: 'test', prop2: 'abc'}, contentTitle: 'Cool Content!', contentDescription: 'Cool Content Description'}`

###### <a id='linkproperties'></a>[`linkProperties object`](#linkproperties)
An object of link properties.
`{ feature: 'share', channel: 'RNApp' }`

###### <a id='controlparams'></a>controlParams object`](#controlparams)
Control parameters for the link.
`{ $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }`

###### <a id='createbranchuniversalobject'></a>[`createBranchUniversalObject(canonicalIdentifier, universalObjectOptions): object`](#createbranchuniversalobject)
Create a branch universal object.
**canonicalIdentifier** the unique identifier for the content.
**universalObjectOptions** options for contentTitle, contentDescription and metadata.
Returns an object with methods `generateShortUrl`, `registerView`, `listOnSpotlight`, and `showShareSheet`.

###### <a id='showsharesheet'></a>[`branchUniversalObject.showsharesheet(shareOptions, linkProperties, controlParams): object`](#showsharesheet)
** shareOptions ** as defined [above](#shareoptions)
** linkProperties ** as defined [above](#linkproperties)
** controlParams ** as defined [above](#controlparams)
Returns an object with `{ channel, completed, error }`

######  <a id='generateshorturl'></a>[`branchUniversalObject.generateShortUrl(linkProperties, controlParams): object`](#generateshorturl)
** linkProperties ** as defined [above](#linkproperties)
** controlParams ** as defined [above](#controlparams)
Returns an object with `{ url }`

######  <a id='registerview'></a>[`branchUniversalObject.registerView()`](#registerview)
Register a view for this universal object.

######  <a id='listonspotlight'></a>[`branchUniversalObject.listOnSpotlight()`](#listonspotlight)
List the univeral object in spotlight (ios only).

## Referral Methods
######  <a id='loadrewards'></a>[`branchUniversalObject.loadRewards()`](#loadrewards)
Load rewards.

######  <a id='redeemrewards'></a>[`branchUniversalObject.redeemRewards(amount, bucket)`](#redeemrewards)
Redeem rewards.
** amount ** the amount to redeem
** bucket ** (optional) the bucket to redeem from.

######  <a id='getcredithistory'></a>[`branchUniversalObject.getCreditHistory(): array`](#getcredithistory)
Get the credit history as an array.
