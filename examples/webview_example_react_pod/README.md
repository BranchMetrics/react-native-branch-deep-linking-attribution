# webview_example_react_pod

**WORK IN PROGRESS**

This is a pure React Native app built without `react-native link`. Instead it
uses the React pod from node_modules, like a hybrid app (native app that embeds
a RN component; see webview_example_native_ios, testbed_native_ios). This has
the benefit of automatically controlling all native dependencies through
CocoaPods by eliminating the Libraries group from the main project. There is
considerable other manual setup as well when not using `react-native link`.

Otherwise this app is basically identical with webview_example. All components
are RN and within the same RCTRootView in the app (unlike
webview_example_native_ios, which includes both native and RN components).

## Building

Just install the NPM dependencies using `yarn`. No other setup
is required to run on a simulator.
