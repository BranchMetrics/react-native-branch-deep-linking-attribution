# Release 2.0.0

## Goals

The main motives behind this release are to:

- Reduce the number of manual steps required to get started.
- Remove any need for CocoaPods, Carthage or manual iOS SDK installation in a React Native app.
- Pin to specific versions of the native SDKs to avoid issues arising from version mismatches.
- Fully support integration of react-native-branch in a React Native component within a native
  app that also uses the native Branch SDK.

These changes are fairly radical, so we're eager to get feedback before rolling this out to
production. Please open issues in this repo with any questions or problems.

Further plans for 2.0.0:

- Provide a script to automate project configuration changes, such as adding a Branch key and setting up Universal Link/App Link domains.
- Provide a testbed_native_android illustrating integration into an existing Android app.
- TBD

## Changes

- The native iOS SDK source (version 0.13.5) is now included in the RNBranch project and is no longer a required external dependency.
- A jar file (version 2.5.9) is included for the Android SDK.
- A Branch-SDK podspec is included in the NPM module for use in native apps that use the React pod from node_modules.
- Two new testbed apps are available:
  + testbed_simple illustrates the simplest way to integrate the SDK using `react-native link`.
  + testbed_native_ios illustrates including `react-native-branch` in a React Native component within a native iOS app.

There have so far been no API changes in 2.0.0.

## SDK Integration

### Initial installation

#### Simple

```bash
npm install --save react-native-branch@2.0.0-beta.1
react-native link react-native-branch
```

Then follow the [setup instructions](./setup.md).

There's no need for CocoaPods or Carthage. The testbed_simple app was built this way.

#### In a native app using the React pod

Add both the `react-native-branch` and `Branch-SDK` pods to your Podfile like this:
```Ruby
pod "React", path: "../node_modules/react-native"
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
pod "react-native-branch", path: "../node_modules/react-native-branch"
pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"
```

Run `pod install` after making this change.

##### Carthage

Remove Branch.framework from your app's dependencies. Also remove Branch.framework from your `carthage copy-frameworks` build phase.

##### Manually installed

Remove Branch.framework from your app's dependencies.
