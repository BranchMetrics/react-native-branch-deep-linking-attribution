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
```

or

```bash
npm i
```

then

```bash
cd ios
bundle check || bundle install
bundle exec pod install
```
