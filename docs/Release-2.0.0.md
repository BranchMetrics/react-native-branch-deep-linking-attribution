# Release 2.0.0

## Changes

### Building, configuration and examples

- The native iOS SDK source is now included in the RNBranch project and is no longer a required external dependency.
- A jar file is included for the Android SDK.
- A Branch-SDK podspec is included in the NPM module for use in native apps that use the React pod from node_modules.
- Five new example apps are available:
  + testbed_simple illustrates the simplest way to integrate the SDK using `react-native link`.
  + testbed_native_ios illustrates including `react-native-branch` in a React Native component within a native iOS app.
  + testbed_native_android illustrates including `react-native-branch` in a React Native component within a native Android app.
  + webview_example is a realistic example of SDK integration following best practices.
  + webview_example_native_ios is a realistic example of SDK integration in a React Native component within a Swift app.
- An optional `branch.json` file may be added to an app to control certain Branch configuration
  parameters. If presetnt, it is automatically integrated when using `react-native link`.

### JS API changes

- Added missing `AddToCartEvent`, which was listed in the docs but not present in the SDK.
- Disabled `setDebug()`, which has never worked and is unsupportable. See https://rnbranch.app.link/hGj7E61EhD
  for details.
- Removed the filter in the native layers that was passing null `params` to the `branch.subscribe` callback.
  Now `params` will never be null in the callback. Non-Branch links are
  available using the `+non_branch_link` parameter, like the rest of Branch's SDKs. See in particular the
  webview_example for updated usage. The `uri` parameter still exists, and its behavior is largely unchanged, but
  it should now be considered deprecated and will be removed in a future release.

### iOS API changes

An `RNBranchLinkOpenedNotification` was added to allow link routing in native apps that integrate `react-native-branch`.
See testbed_native_ios and webview_example_native_ios for examples.

### Android API changes

An overload of `Branch.initSession` was introduced that accepts a `Branch.BranchUniversalReferralInitListener` to allow link routing in native apps that integrate `react-native-branch`. An `RNBranchModule.NATIVE_INIT_SESSION_FINISHED_EVENT` local broadcast is also available for the same purpose. See testbed_native_android for an example.

## SDK Integration

### Initial installation

#### Simple

```bash
npm install --save react-native-branch@2.0.0-beta.6
react-native link react-native-branch
```

Then follow the [setup instructions](./setup.md).

There's no need for CocoaPods or Carthage. The testbed_simple app was built this way.

#### In a native app using the React pod

Add both the `react-native-branch` and `Branch-SDK` pods to your Podfile like this:
```Ruby
pod "React", path: "../node_modules/react-native"
# The following line is necessary with use_frameworks! or RN >= 0.42.
pod "Yoga", path: "../node_modules/react-native/ReactCommon/yoga"
pod "react-native-branch", path: "../node_modules/react-native-branch"
pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"
```
Run `pod install`. Then follow the [setup instructions](./setup.md).

Note that the location of node_modules relative to your Podfile may vary. The example above assumes the iOS app is under the ios subdirectory.

The testbed_native_ios and webview_example_native_ios apps were built this way.

### Existing apps updating to 2.0

#### Remove the Branch SDK from your project

##### CocoaPods

###### Apps built using react-native link

Remove "Branch" from your Podfile. Run `pod install` after updating the Podfile. This is
necessary to regenerate the Pods project without the Branch pod.

If you added CocoaPods to your project just for the Branch pod, you can remove CocoaPods entirely from your app using the [pod deintegrate](https://guides.cocoapods.org/terminal/commands.html#pod_deintegrate) command.

###### Using the React pod

Replace `pod "Branch"` in your Podfile with `pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"`.
```Ruby
pod "React", path: "../node_modules/react-native"
# The following line is necessary with use_frameworks! or RN >= 0.42.
pod "Yoga", path: "../node_modules/react-native/ReactCommon/yoga"
pod "react-native-branch", path: "../node_modules/react-native-branch"
pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"
```

Run `pod install` after making this change.

##### Carthage

Remove Branch.framework from your app's dependencies. Also remove Branch.framework from your `carthage copy-frameworks` build phase.

##### Manually installed

Remove Branch.framework from your app's dependencies.
