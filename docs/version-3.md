# react-native-branch version 3.0

This version is maintained to support versions of react-native < 0.60. If you
are using react-native >= 0.60, please update to version 4.0 of this SDK.

## Installation

1. `yarn add react-native-branch`
2. (Optional) Add a branch.json file to the root of your app project. See https://rnbranch.app.link/branch-json.
3. `react-native link react-native-branch`
4. Install the native Branch SDK using [CocoaPods](./cocoapods.md) or [Carthage](./carthage.md).
5. Follow the [setup instructions](../README.md#setup).

## iOS imports

Use the following to import the react-native-branch SDK depending on your
configuration:

Objective-C (static library, including Swift bridging header):
```Obj-C
#import <react-native-branch/RNBranch.h>
```

Objective-C (framework):
```Obj-C
@import react_native_branch;
```

Swift (framework):
```Swift
import react_native_branch
```

Version 4.0 provides one import for each language, independent of other
configuration and settings.
