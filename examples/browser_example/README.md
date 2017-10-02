# browser_example

This app implements a Branch link browser using the Branch SDK to resolve
deep links rather than a web redirect. It accomplishes this using the
`branch.openURL` method.

To test it in a simulator or emulator without modification, enter the following
URL in the text input: https://b8e9.test-app.link/browser. The webview will
load the following Wikipedia page: https://en.wikipedia.org/wiki/Web_browser.

## Building

Just install the NPM dependencies using `npm install` or `yarn`. No other setup
is required to run on a simulator.

## React Native setup

If you are new to React Native, follow these steps to get set up and run.

```bash
npm install -g react-native-cli
```

Once you've installed dependencies with `yarn` or `npm`:

```bash
react-native run-android
```

or

```bash
react-native run-ios
```

You can also run the projects under the `android` and `ios` folders in Xcode or
Android Studio.

**Android note:**

If not using `react-native run-android`, you must also start the React packager
manually:

```js
npm start
```

If running on a device, it may also be necessary to expose the packager port via
`adb reverse`:

```js
adb reverse tcp:8081 tcp:8081
```
