# testbed applications

**Work in progress**

There are three working examples in this directory:

[testbed_carthage]
[testbed_cocoapods]
[testbed_manual]

These differ by the method used to install the Branch SDK for iOS.
The first uses Carthage. The others use Cocoapods for the Branch SDK.
The `testbed_cocoapods` project uses Cocoapods also for the native
React SDK.

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
