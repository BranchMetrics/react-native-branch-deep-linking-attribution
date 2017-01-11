# testbed applications

**Work in progress**

There are two working examples in this directory:

[testbed_carthage](./testbed_carthage)

[testbed_manual](./testbed_manual)

These differ by the method used to install the Branch SDK for iOS.
The first uses Carthage. The second uses cocoapods.

To build and run any of them, you must first change to that directory
and install dependencies from NPM, e.g.:

```bash
cd testbed_manual
npm install
```

Or

```bash
cd testbed_carthage
yarn
```

Having installed the NPM dependencies, you can simply use
`react-native run-ios`. The exception is `testbed_carthage`, which
requires further setup.

## Carthage installation

```bash
cd testbed_carthage/ios/
carthage update
```

## Known issues

There is also a [testbed_cocoapods](./testbed_cocoapods) that can be built but generates
a runtime error. This will be fixed before the release of 0.10.0.

## Android

The Android implementation of testbed_manual should work, but is untested.
The other Android implementations need to be finished before release of
0.10.0.
