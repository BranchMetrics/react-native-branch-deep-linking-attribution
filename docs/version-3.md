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


## Gradle dependency

If you use `react-native link`, no further change is necessary to your `app/build.gradle`.

In a native app, import the `react-native-branch` project like this:

```gradle
implementation project(':react-native-branch')
```

If you're using an older version of Gradle, you may need `compile` rather than
`implementation`. If you are already using the native Branch SDK in your app,
it will now be imported from Maven via `react-native-branch` as a dependency.
Remove any reference to `io.branch.sdk.android:library` from your dependencies
to avoid conflicts.

Also add the project to your `settings.gradle`:

```gradle
include ':react-native-branch'
project(':react-native-branch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-branch/android')
```

The location of your `node_modules` folder may vary.
