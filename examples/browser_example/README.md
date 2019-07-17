# browser_example

This app implements a Branch link browser using the Branch SDK to resolve
deep links rather than a web redirect. It accomplishes this using the
`branch.openURL` method.

To test it in a simulator or emulator without modification, enter the following
URL in the text input: https://b8e9.test-app.link/browser. The webview will
load the following Wikipedia page: https://en.wikipedia.org/wiki/Web_browser.

## Building

To build and run:

```bash
yarn
cd ios
bundle check || bundle install
bundle exec pod install
```

## AndroidX note

The react-native-webview package had not been updated to AndroidX when last
checked. It is necessary manually to convert it to AndroidX using the tools
in AndroidStudio. Alternately, after running `yarn` to install the contents
of `node_modules`, you can run

```bash
cp -r ../androidx-deps/react-native-webview node_modules
```

This will copy updated Java source for the version in the yarn.lock into the
build tree so that an Android build will succeed.
