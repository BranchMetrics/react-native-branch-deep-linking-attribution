# testbed applications

There are two working examples in this directory:

[testbed_carthage](./testbed_carthage)

[testbed_cocoapods](./testbed_cocoapods)

These differ by the method used to install the Branch SDK for iOS.

To build and run any of them, you must first change to that directory
and install dependencies from NPM, e.g.:

```bash
cd testbed_cocoapods
npm install
```

Or

```bash
cd testbed_carthage
yarn
```

Having installed the NPM dependencies, you can simply use
`react-native run-ios` (or `react-native run-android`). The dependencies
from CocoaPods and Carthage for iOS are already present.
