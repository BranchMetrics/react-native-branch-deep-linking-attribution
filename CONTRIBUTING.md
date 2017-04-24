## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/branchmetrics/react-native-branch/issues) to make sure your issue hasn’t already been reported.

### Help Us Help You

Take some time to structure your code and question in a way that is easy to read to entice people to answer it. For example, we encourage you to use syntax highlighting, indentation, and split text in paragraphs.

## Development

Visit the [issue tracker](https://github.com/branchmetrics/react-native-branch/issues) to find a list of open issues that need attention.

To get started developing:
1. fork the repo
2. clone react-native-branch locally
3. `cd react-native-branch && npm i`

Before submitting a PR, test the new functionality or bugfix in android & ios, and if possible write a unit test.

### Testing and Linting

All contributions must pass `npm run lint` and `npm test` before being accepted.

#### Native Unit Tests

All contributions must also pass native unit testing. The native tests depend on the native React source
from node_modules. To run the native unit tests:

```
yarn
bundle install
bundle exec fastlane test_android
bundle exec fastlane test_ios
```

There is also a `runAllTests` script at the repository root for convenience, which also runs `npm run lint` and `npm test`.
This script requires macOS because it runs the iOS tests.

Notes on native unit tests and Fastlane:

- CI uses Ruby 2.4.0. There is no specific Ruby requirement, but it's best to use a fairly current version.
- The Android tests require the `ANDROID_HOME` environment variable to be properly set to point to the location of the
  Android SDK. If not set, the `test_android` lane will set it to `~/Library/Android/sdk`, which is the default location
  on a Mac. Either:
  ```
  export ANDROID_HOME=/path/to/android/sdk
  bundle exec fastlane test_android
  ```
  or
  ```
  ANDROID_HOME=/path/to/android/sdk bundle exec fastlane test_android
  ```
- The iOS tests must be run on macOS with Xcode 8 installed.
- You can also run the native unit tests in Android Studio or Xcode if you prefer, using the projects under native-tests. You must install the NPM dependencies for this repo first.
- There is no need to run `pod install` or even install CocoaPods in order to run the unit tests.
- If you don't have access to macOS and are not changing anything in the iOS codebase, there is no need to
  run the iOS unit tests. They will run in CI. If anything fails the error will be reported there.

### Docs

Improvements to the documentation are always welcome. In the docs we abide by typographic rules, so instead of ' you should use ’. Same goes for “ ” and dashes (—) where appropriate. These rules only apply to the text, not to code blocks.

## Thanks

Thank you for contributing!
