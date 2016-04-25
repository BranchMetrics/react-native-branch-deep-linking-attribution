# Branch Metrics React Native SDK Reference

This is a repository of our open source React Native SDK. Huge shoutout to our friends at [Dispatcher, Inc.](https://dispatchertrucking.com) for their help in compiling the initial version of this SDK.

## Installation

1. `npm install --save react-native-branch`
2. `rnpm link react-native-branch` **or** link the project [manually](./docs/installation.md#manual-linking)
3. Add `pod 'react-native-branch', :path => '../node_modules/react-native-branch'` to your ios/Podfile ([details](./docs/installation.md#cocoa-pods))
4. `cd ios && pod install`

[Full Installation Instructions](./docs/installation.md)

## Next Steps
Please see our main [SDK Integration Guide](https://dev.branch.io/getting-started/sdk-integration-guide/) for complete setup instructions.

- Enable [Universal & App Links](https://dev.branch.io/getting-started/universal-app-links) — traditional URI scheme links are no longer supported in many situations on iOS 9.2+, and are a less than ideal solution on new versions of Android. To get full functionality from your Branch links on iOS devices, **you should enable Universal Links as soon as possible.**
- Learn how to [create Branch links](https://dev.branch.io/getting-started/creating-links-in-apps/) in your app.
- Set up [deep link routing](https://dev.branch.io/getting-started/deep-link-routing/)

## Additional Resources

- [SDK Integration guide](https://dev.branch.io/recipes/add_the_sdk/react/) *Start Here*
- [Testing](https://dev.branch.io/getting-started/integration-testing/guide/react/)
- [Support portal, FAQ](http://support.branch.io/)

## Usage

```js
var branch = require('react-native-branch');

//Receives the initSession's result as soon as it becomes available
branch.getInitSession(({params, error}) => {});
branch.subscribe(({params, error}) => {});

branch.setDebug();
let params = await branch.getLatestReferringParams(); // params from last open
let params = await branch.getFirstReferringParams(); // params from original install
branch.setIdentity("Your User's ID");
branch.userCompletedAction("Purchased Item", {item: 123});

var shareOptions = {messageHeader: "Check this out!", messageBody: "Check this cool thing out: "};
var branchUniversalObject = {metadata: {prop1: "test", prop2: "abc"}, canonicalIdentifier: "RNBranchSharedObjectId", contentTitle: "Cool Content!", contentDescription: "Cool Content Description", contentImageUrl: ""};
var linkProperties = {feature: 'share', channel: 'RNApp'};
let {channel, completed, error} = await branch.showShareSheet(shareOptions, branchUniversalObject, linkProperties);

branch.logout();
```

## @TODO
- [ ] Allow defining [link control parameters](https://dev.branch.io/getting-started/configuring-links/guide/#link-control-parameters) (`addControlParam` in iOS and `addControlParameter` in Android native SDKs).
- [ ] Support full set of [link analytics labels](https://dev.branch.io/getting-started/configuring-links/guide/#analytics-labels) and [BranchUniversalObject parameters](https://dev.branch.io/getting-started/branch-universal-object/guide/ios/#parameters).
