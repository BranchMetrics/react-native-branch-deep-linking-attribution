# testbed applications

**Work in progress**

There are three working examples in this directory:

[testbed_carthage](./testbed_carthage)

[testbed_cocoapods](./testbed_cocoapods)

[testbed_manual](./testbed_manual)

These differ by the method used to install the Branch SDK for iOS.
The first uses Carthage. The other two use Cocoapods. testbed_manual
only uses Cocoapods for the Branch SDK. testbed_cocoapods also takes
the native React libraries and this package (react-native-branch) from
Cocoapods. The names of these projects may change before the release
of 0.10.0.

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
`react-native run-ios`. The dependencies from Cocoapods and Carthage
are already present.

## Android

The Android implementation of testbed_manual should work, but is untested.
The other Android implementations need to be finished before release of
0.10.0.
