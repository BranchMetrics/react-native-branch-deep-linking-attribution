# Example applications

There are several working examples in this directory.

See each app for further details, including build instructions.

[testbed_native_android]: ./testbed_native_android
[testbed_native_ios]: ./testbed_native_ios
[testbed_simple]: ./testbed_simple
[webview_example]: ./webview_example
[webview_example_native_ios]: ./webview_example_native_ios

## Automatically set up iOS Branch configuration with Fastlane

To run any of the iOS examples ([testbed_native_ios], [testbed_simple], [webview_example], [webview_example_native_ios]) on a device, you can use Fastlane to set the following
Branch-related configuration parameters without changing settings manually in Xcode.

- Branch live key
- Branch test key
- Branch Universal Link domain(s)
- Application bundle identifier
- Code-signing team

Once this is done, you can deploy the app on a device and open Universal Links in the app on the device.

To use this tool:

```bash
export BRANCH_LIVE_KEY=key_live_xxxx
export BRANCH_TEST_KEY=key_test_yyyy
export BRANCH_APP_LINK_SUBDOMAIN=myapp # myapp.app.link
# OR
export BRANCH_DOMAINS=example.com # for custom domains
bundle install
cd webview_example
bundle exec fastlane update_branch
```

The plugin crawls the Branch-generated apple-app-site-association file for the domain to get the
team and bundle identifiers that you entered in the Branch Dashboard. The live or test key is required.
Both are not required, but both may be supplied to set up both environments.

## webview_example apps

These apps are realistic examples of a content-sharing app that includes link routing and follows best practices.

### [webview_example]

This is a pure React Native app that integrates the react-native-branch NPM module.

### [webview_example_native_ios]

This is a Swift app that integrates the Branch SDK and the react-native-branch NPM module in a React Native component.

## testbed apps

The testbed apps all include the same React Native application code. They differ by which versions of the SDK
they use and how React Native is integrated at the native level.

### [testbed_simple]

This app illustrates the simplest means of integrating react-native-branch into a React Native app, using `react-native link`.

### [testbed_native_android]

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native Android app.

### [testbed_native_ios]

This app illustrates how to integrate the react-native-branch SDK into a React Native component within an existing native iOS app using the React, react-native-branch and Branch-SDK pods from node_modules.
