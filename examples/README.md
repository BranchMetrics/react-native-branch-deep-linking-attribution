# Example applications

There are several working examples in this directory.

See each app for further details, including build instructions.

[browser_example]: ./browser_example
[testbed_native_android]: ./testbed_native_android
[testbed_native_ios]: ./testbed_native_ios
[testbed_simple]: ./testbed_simple
[webview_example]: ./webview_example
[webview_example_native_ios]: ./webview_example_native_ios
[webview_tutorial]: ./webview_tutorial

## [browser_example]

This app demonstrates use of the `branch.openURL` method to build a Branch link browser that loads Branch
links using the SDK to resolve the links rather than web redirects.

## webview_example apps

These apps are realistic examples of a content-sharing app that includes link routing and follows best practices.

### [webview_example]

This is a pure React Native app that integrates the react-native-branch NPM module.

### [webview_example_native_ios]

This is a Swift app that integrates the Branch SDK and the react-native-branch NPM module in a React Native component.

### [webview_tutorial]

Build webview_example step by step, starting with an app that does not include the Branch SDK.

## testbed apps

The testbed apps all include the same React Native application code. They differ by which versions of the SDK
they use and how React Native is integrated at the native level.

### [testbed_simple]

This app illustrates the simplest means of integrating react-native-branch into a React Native app, using `react-native link`.

### [testbed_native_android]

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native Android app.

### [testbed_native_ios]

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native iOS app using the React, react-native-branch and Branch-SDK pods from node_modules.
