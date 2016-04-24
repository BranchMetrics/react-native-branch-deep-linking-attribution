# Branch Metrics React Native SDK Reference

This is a repository of our open source React Native SDK. Huge shoutout to our friends at [Dispatcher, Inc.](https://dispatchertrucking.com) for their help in compiling the initial version of this SDK.

Tested with React Native 0.21.0.

Supports iOS and Android.

> #### Limited Functionality!
>
> The React Native SDK currently implements a subset of Branch features. We plan to add further functionality soon, and would gladly accept pull requests!
>
> **Wish List:**
>
> - [x] Implement a `getShortUrl` method (`getShortUrlWithLinkProperties` in iOS and `generateShortUrl` in Android native SDKs).
> - [ ] Allow defining [link control parameters](https://dev.branch.io/getting-started/configuring-links/guide/#link-control-parameters) (`addControlParam` in iOS and `addControlParameter` in Android native SDKs).
> - [ ] Support full set of [link analytics labels](https://dev.branch.io/getting-started/configuring-links/guide/#analytics-labels) and [BranchUniversalObject parameters](https://dev.branch.io/getting-started/branch-universal-object/guide/ios/#parameters).

## Installation

The SDK is available as a package on NPM. To get it, use these commands:

```sh
npm install rnpm -g
npm install --save react-native-branch
rnpm link react-native-branch
cd node_modules/react-native-branch
pod install #Only required for iOS
```

### Android

Sometimes `rnpm` link creates incorrect relative paths, leading to compilation errors. Ensure that the following files look as described and all linked paths are correct:

```gradle
// file: android/settings.gradle
...

include ':react-native-branch', ':app'

// The relative path to the react-native-branch directory tends to often be prefixed with one too many "../"s
project(':react-native-branch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-branch/android')
```

```gradle
// file: android/app/build.gradle
...

dependencies {
    ...
    compile project(':react-native-branch')
}
```

### iOS

1. Navigate into the SDK package directory: `cd node_modules/react-native-branch`.
1. Use CocoaPods to install dependencies: `pod install`.
1. Drag **/node_modules/react-native-branch/Pods/Pods.xcodeproj** into the **Libraries** folder of your Xcode project. ![](https://dev.branch.io/img/pages/getting-started/sdk-integration-guide/pod-import.png)
1. In Xcode, drag the `libBranch.a` Product from **Pods.xcodeproj** into your the **Link Binary with Libraries** section of Build Phases for your project’s target. ![](https://dev.branch.io/img/pages/getting-started/sdk-integration-guide/link-pod-binary.png)

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
let result = await branch.getInitSessionResultPatiently();

branch.setDebug();
let params = await branch.getLatestReferringParams();
let params = await branch.getFirstReferringParams();
branch.setIdentity("Your User's ID");
branch.userCompletedAction("Purchased Item", {item: 123});

var shareOptions = {messageHeader: "Check this out!", messageBody: "Check this cool thing out: "};
var branchUniversalObject = {metadata: {prop1: "test", prop2: "abc"}, canonicalIdentifier: "RNBranchSharedObjectId", contentTitle: "Cool Content!", contentDescription: "Cool Content Description", contentImageUrl: ""};
var linkProperties = {feature: 'share', channel: 'RNApp'};
let {channel, completed, error} = await branch.showShareSheet(shareOptions, branchUniversalObject, linkProperties);

branch.logout();
```
