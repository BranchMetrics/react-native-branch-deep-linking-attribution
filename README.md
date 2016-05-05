# Branch Metrics React Native SDK Reference

This is a repository of our open source React Native SDK. Huge shoutout to our friends at [Dispatcher, Inc.](https://dispatchertrucking.com) for their help in compiling the initial version of this SDK.

## Installation

1. `npm install --save react-native-branch`
2. `rnpm link react-native-branch` **or** link the project [manually](./docs/installation.md#manual-linking)
3. Add `pod 'Branch'` to your ios/Podfile ([details](./docs/installation.md#cocoa-pods))
4. `cd ios && pod install`

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
var branch = require('react-native-branch')

// Subscribe to incoming links (both branch & non-branch)
branch.subscribe(({params, error, uri}) => {
  if (params) { /* handle branch link */ }
  else { /* handle uri */ }
})

branch.setDebug()
let params = await branch.getLatestReferringParams() // params from last open
let params = await branch.getFirstReferringParams() // params from original install
branch.setIdentity("Your User's ID")
branch.userCompletedAction("Purchased Item", {item: 123})

var shareOptions = {messageHeader: "Check this out!", messageBody: "Check this cool thing out: "}
var branchUniversalObject = {metadata: {prop1: "test", prop2: "abc"}, canonicalIdentifier: "RNBranchSharedObjectId", contentTitle: "Cool Content!", contentDescription: "Cool Content Description", contentImageUrl: ""}
var linkProperties = {feature: 'share', channel: 'RNApp'}
let {channel, completed, error} = await branch.showShareSheet(shareOptions, branchUniversalObject, linkProperties)

branch.logout()
```
