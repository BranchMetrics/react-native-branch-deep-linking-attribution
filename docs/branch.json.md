# branch.json configuration file (optional)

Certain Branch configuration options may be controlled using a JSON configuration file
in a React Native app project. This feature is rapidly evolving. Support will be added
for further parameters and custom product flavors (Android) and build schemes (iOS).
Watch this space for changes.

Starting in release 2.0.0-beta.7, if `branch.json` is present in the app bundle, the
react-native-branch SDK will use it to set certain options. This is useful for supporting
certain methods in the native SDKs that must be called before the native SDK initializes.

## Add the files to your project

Be sure to commit `branch.json` and `branch.debug.json` to source control after adding
them to your project (after running `react-native link`).

### Using react-native link

If `branch.json` or `branch.debug.json` exists in a React Native application project
using react-native-branch, they will be added to the native projects when `react-native link`
is run. For example:

```bash
yarn add react-native-branch@2.0.0-beta.7
cp node_modules/react-native-branch/branch.example.json branch.json
react-native link react-native-branch
```

#### Projects that already use react-native-branch

Run `react-native unlink react-native-branch` first. For example:

```bash
react-native unlink react-native-branch
cp node_modules/react-native-branch/branch.example.json branch.json
react-native link react-native-branch
```

### Manual integration without react-native link

**NOTE: This is required for RN > 0.60**

#### Android

Put your `branch.json` file in `app/src/main/assets/branch.json`.

#### iOS

Add `branch.json` to your Xcode project using File > Add Files to "MyProject.xcodeproj".
Also add it to the Copy Bundle Resources build phase for each application target in
the project that uses the Branch SDK.

## Branch configuration per build type and platform

It is possible to include different versions of the configuration for debug and release
builds as well as for iOS and Android. The following files will be used, in order.

### Android debug
- branch.android.debug.json
- branch.debug.json
- branch.android.json
- branch.json

### Android release
- branch.android.json
- branch.json

### iOS debug
- branch.ios.debug.json
- branch.debug.json
- branch.ios.json
- branch.json

### iOS release
- branch.ios.json
- branch.json

### Using react-native link

Optionally add both `branch.json` and `branch.debug.json` to the root of your app
project and run `react-native link react-native-branch` (after running `react-native unlink react-native-branch` first if the module is already integrated).

### Android

If `app/src/debug/assets/branch.json` exists, that configuration will be used for
debug builds instead of `app/src/main/assets/branch.json`.

### iOS

Add `branch.debug.json` to your project and the Copy Bundle Resources build phase(s)
as discussed above. If this file is present, it will be used in debug builds instead
of `branch.json`.

## Contents

Note that support for setting Branch keys on Android in branch.json requires
version 3.x of react-native-branch, using [RNBranchModule.getAutoInstance()](https://help.branch.io/developers-hub/docs/react-native#section-updating-from-an-earlier-version-or-starting-with-v-3-0-0)

|key|description|type|
|---|---|---|
|branchKey|The Branch key to use. Overrides liveKey, testKey and useTestInstance.|String|
|liveKey|The live Branch key to use if useTestInstance is false. Ignored if useTestInstance is true or branchKey is present.|String|
|debugMode|If true, `setDebug` will be called in the native SDK, enabling testing of install events.|Boolean|
|delayInitToCheckForSearchAds|If true, `delayInitToCheckForSearchAds` will be called on the iOS Branch instance. Ignored on Android.|Boolean|
|enableFacebookLinkCheck|If true, results in calling `enableFacebookAppLinkCheck()` in the Branch Android SDK and `registerFacebookDeepLinkingClass:` in the Branch iOS SDK.|Boolean|
|testKey|The test Branch key to use if useTestInstance is true. Ignored if useTestInstance is false or branchKey is present.|String|
|useTestInstance|Determines whether liveKey or testKey is used if branchKey is not present.|Boolean|

## Example

See [branch.example.json](https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution/blob/master/branch.example.json) in the root of this repo.

```json
{
  "debugMode": true,
  "liveKey": "key_live_xxxx",
  "testKey": "key_test_yyyy",
  "useTestInstance": true,
  "delayInitToCheckForSearchAds": true,
  "enableFacebookLinkCheck": true
}
```
