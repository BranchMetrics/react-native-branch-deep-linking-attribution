# react-native-branch 4.0

## Updating from 3.x

### React Native 0.60 required

The peer dependency on the react-native package for version 4.x is ^0.60.0.
It is not possible to build using older versions of react-native. Your app
must be updated to use react-native 0.60 or later.

### AndroidX required

Android support requires converting your app to AndroidX.

### CocoaPods required

CocoaPods is the mainstream integration path for iOS as of react-native 0.60.
Version 4.0.0 of this SDK may not work with any other option. This may be
revisited in the future, but it's not yet clear how feasible it would be to
support any other option. At any rate, if an RN 0.60 app is set up to use
CocoaPods with `use_native_modules!`, the CocoaPods integration of
react-native-branch will be automatic. It would be necessary to disable
CocoaPods throughout a RN app in order to support any other solution for this
SDK. It's not obvious that RN/Facebook will support any other option from here
forward. If they don't, we can't.

### Autolinking

The `react-native link` command is no longer required. Once you have updated
your app to RN 0.60, run `react-native unlink` once for every native dependency,
including this one:

```bash
react-native unlink react-native-branch
```

This will remove entries for this SDK from your Podfile, settings.gradle and
app/build.gradle. It will also remove some code from your MainApplication.java
if you are still using `RNBranchPackage`. The entire `getPackages()` method in
your MainApplication.java with RN 0.60 should look like this:

```Java
@Override
protected List<ReactPackage> getPackages() {
  return new PackageList(this).getPackages();
}
```

No mention of RNBranch is necessary in that method. **Note:** The call to
`RNBranchModule.getAutoInstance(this);` is still required in `onCreate()` as
well as the integration steps in MainActivity.java.

After running `react-native unlink react-native-branch` (and any other native
modules), it is necessary also to run:

```bash
cd ios
pod install
```

It may be necessary to run `pod update` instead of `pod install` if the version
number of anything under `node_modules` has increased.

### Update iOS imports

If you are using Objective-C, you can use:

```Obj-C
#import <RNBranch/RNBranch.h>
```

This form is independent of other build options. Clang will automatically
convert it to `@import RNBranch;` whenever possible. As of version 0.60.3,
react-native does not support `use_frameworks!` in a Podfile. Once that is
supported, the same `#import <RNBranch/RNBranch.h>` will still work. However,
with `use_frameworks!` you will also have the option to explicitly use
`@import RNBranch;`.

Swift apps usually require `use_frameworks!`. It is possible to use this SDK
with Swift and RN 0.60.3 by adding `#import <RNBranch/RNBranch.h>` to a
bridging header. A Swift import statement will not work without
`use_frameworks!`. Once that is supported, you can use `import RNBranch` in
your Swift source code.

The previous include path, `react-native-branch` caused problems with Clang,
CocoaPods and React Native because of the hyphens.

### branch.json

The postlink hook that added `branch.json` to a project automatically when
running `react-native link` has been removed. It is currently necessary to
integrate `branch.json` manually as described
[here](branch.json.md#manual-integration-without-react-native-link). Note
that if you run `react-native unlink react-native-branch` after updating to the
version 4.0.0, there is no postunlink hook, and branch.json will not be removed
from your project if found. Manual integration is only
necessary for new projects.

## New installations

In an app using RN 0.60, simply run:

```bash
yarn add react-native-branch
cd ios
pod install
```

Add branch.json to your project manually as described above if you wish.
Note you should not run `react-native link` for this SDK.

Then follow the common Branch setup instructions.

Finally:

```bash
react-native run-ios
```

or

```bash
react-native run-android
```

Or use Xcode/AndroidStudio to open, build and run your app.
