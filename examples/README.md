# Example applications

There are several working examples in this directory.

See each app for further details, including build instructions.

## webview_example apps

These apps are realistic examples of a content-sharing app that includes link routing and follows best practices.
It uses the current version of the SDK (2.0.0-beta.1). The React Native code will also work with 1.1 for webview_example.
The webview_example_native_ios app requires 2.0.

### [webview_example](./webview_example)

### [webview_example_native_ios](./webview_example_ios)

## testbed apps

The testbed apps all include the same React Native application code. They differ by which versions of the SDK
they use and how React Native is integrated at the native level.

### 1.1 (production)

These two apps illustrate integrating the production
SDK release. They differ only by how the iOS native SDK
is integrated, using Carthage or CocoaPods.

#### [testbed_carthage](./testbed_carthage)

#### [testbed_cocoapods](./testbed_cocoapods)

### 2.0 (beta)

These apps illustrate integrating the 2.0 beta release,
without need for Carthage, CocoaPods or manual installation.

#### [testbed_simple](./testbed_simple)

This app illustrates the simplest means of integrating react-native-branch into a React Native app, using `react-native link`.

#### [testbed_native_android](./testbed_native_android)

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native Android app.

#### [testbed_native_ios](./testbed_native_ios)

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native iOS app using the React, react-native-branch and Branch-SDK pods from node_modules.
