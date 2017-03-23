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

### Simple

```bash
npm install --save react-native-branch@2.0.0-beta.1
react-native link react-native-branch
```

Then follow the [setup instructions](./setup.md).

There's no need for CocoaPods or Carthage. The testbed_simple app was built this way.

### In a native app using the React pod

Add both the `react-native-branch` and `Branch-SDK` pods to your Podfile like this:
```Ruby
pod "React", path: "node_modules/react-native"
pod "react-native-branch", path: "node_modules/react-native-branch"
pod "Branch-SDK", path: "node_modules/react-native-branch/ios"
```
Run `pod install`. Then follow the [setup instructions](./setup.md).

The testbed_native_ios app was built this way.

### If you added CocoaPods to your app only for the Branch SDK

You can remove CocoaPods entirely from your app using the [pod deintegrate](https://guides.cocoapods.org/terminal/commands.html#pod_deintegrate) command.
