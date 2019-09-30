2019-09-30 Version 4.2.1
  - Missed version update in iOS RNBranch.m

2019-09-27 Version 4.2.0
  - Update Android Branch SDK to 4.1.0
  - Update iOS Branch SDK to 0.29.0
  - Expose Android reInit session for foreground links

2019-07-25  Version 3.1.1
  - Requires RN < 0.60
  - Fix a runtime iOS issue in 3.1.0
  - Uses native Branch SDKs 3.2.0 (Android), 0.27.1 (iOS).

2019-07-25  Version 4.1.0
  - Requires RN >= 0.60
  - Added optional argument to getLatestReferringParams to allow deferring
    promise resolution.
  - Uses native Branch SDKs 3.2.0 (Android), 0.27.1 (iOS).

2019-07-25  Version 3.1.0
  - Requires RN < 0.60
  - Added optional argument to getLatestReferringParams to allow deferring
    promise resolution.
  - Fix clicked_branch_link false positive (#466) from @sjchmiela.
  - Uses native Branch SDKs 3.2.0 (Android), 0.27.1 (iOS).

2019-07-16  Version 4.0.0
  - Full support for React Native 0.60, AndroidX and autolinking
  - Fix clicked_branch_link false positive (#466) from @sjchmiela.
  - Uses native Branch SDKs 3.2.0 (Android), 0.27.1 (iOS).

2019-05-22  Version 3.0.1
  * Added Carthage/Build/iOS to Framework Search Paths for Carthage support.
  * Uses native Branch SDKs 3.2.0 (Android), 0.27.0 (iOS).

2019-04-30  Version 3.0.0
  * Changed `implementation` to `api` in build.gradle. This exposes the native
      Branch SDK to native code and avoids the need to import
      `io.branch.sdk.android:library` in the `app/build.gradle`, which
      introduces the potential for conflicts. The `app/build.gradle` import
      via `implementation 'io.branch.sdk.android:library:3.1.2'`
      is no longer necessary and should be removed.
  * Uses native Branch SDKs 3.1.2 (Android), 0.27.0 (iOS).

2019-04-19  Version 3.0.0-rc.1
  * Removed docs folder from distro.
  * Updated to iOS SDK 0.26.0, Android 3.1.1.
  * Removed Branch-SDK & react-native-branch-segment podspecs. Removed Branch
    iOS SDK source code from distribution in favor of using CocoaPods.
  * Renamed cached_initial_event parameter +rn_cached_initial_event.
  * Updated all examples to RN 0.59.6, React 16.8.6.
  * NPM is not currently supported (#433). package-lock.json removed from all
    examples. NPM removed from instructions in docs.

    **Updating to 3.0.0**
      - If using the `cached_initial_event` parameter, change it to
        `+rn_cached_initial_event`.
      - \[Android] Add `implementation 'io.branch.sdk.android:library:3.+'` to `app/build.gradle`.
      - \[Android] Change the call to `Branch.getAutoInstance` in `Application.onCreate` to
        `RNBranchModule.getAutoInstance`.
      - \[iOS] Add version 0.26.0 of the Branch pod to your Podfile:

    **Pure RN app with react-native link**
      - If you already have a Podfile, add `pod 'Branch', '0.26.0'`. Then run
        `pod install`.
      - If you don't have a Podfile, add one to your `ios` subdirectory using
         these contents:

        ```
        platform :ios, "9.0"
        use_frameworks!
        pod "Branch", "0.26.0"
        target "MyApp"
        ```

        Change `MyApp` to the name of your application target. Install CocoaPods
         if necessary: https://guides.cocoapods.org/using/getting-started.html#installation.
         Run `pod install` in the ios subdirectory. Note that this creates a workspace called
        `MyApp.xcworkspace` in the same directory. From now on, open the workspace,
        not the project.
      - Note that if your local podspec repo is quite old, you may need to update
         it to get the current version of the Branch SDK. Do this by running
         `pod install --repo-update` or by running `pod repo update` before
         `pod install`.

    **Native iOS app with the react-native-branch pod**
      - Remove `pod 'Branch-SDK'` from your Podfile. Run `pod install`.

2019-03-27  Version 2.3.5
  * Remove docs folder from distro.
  * Updated to iOS SDK 0.26.0.

2019-03-05  Version 3.0.0-beta.3
  * Added react-native-branch-segment.podspec for use with the Segment integration.

2019-02-22  Version 3.0.0-beta.2
  * Remove weak reference from BranchUniversalReferralInitListener (#372)
  * Check for null params (#364)
  * Support for setting Branch keys in branch.json

2019-02-22  Version 2.3.4
  * Remove weak reference from BranchUniversalReferralInitListener (#372)
  * Check for null params (#364)

2019-01-28  Version 3.0.0-beta.1
  * Remove native Branch Android jar from repo and distro.

2018-07-25  Version 2.3.3
  * Updated to iOS SDK 0.25.1 and Android SDK 2.19.0.

2018-07-20  Version 2.3.2
  * Updated to iOS SDK 0.24.1 and Android SDK 2.17.1.
  * V2 event support updates.
  * Link data read updates.
  * Node dependency updates.

2018-04-14  Version 2.2.5
  * `setRequestMetadata` support to RNBranch module.
  * Fixed custom event issues on iOS and Android #317.
  * Fixed async `subscribe` call issue #322.
  * Fixed `getLatestReferringParams` release issue #282.
  * Updated to iOS SDK 0.22.5 and Android SDK 2.15.0.
  * Includes native SDKs 0.22.5 (iOS), 2.15.0 (Android).

2018-01-09  Version 2.2.4
  * Updated to Android SDK 2.14.4.
  * Includes native SDKs 0.22.4 (iOS), 2.14.4 (Android).

2018-01-04  Version 2.2.3
  * Updated to iOS SDK 0.22.4 to fix backward compatibility issues with metadata. #311
  * Includes native SDKs 0.22.4 (iOS), 2.14.3 (Android).

2017-12-22  Version 2.2.2
  * Get rid of unnecessary version check for iOS 8 (#309)
  * Some corrections to handling of Branch Universal Object content metadata.
  * Includes native SDKs 0.21.16 (iOS), 2.14.3 (Android).

2017-12-14  Version 2.2.1
  * Fixes certain BUO content metadata field mappings: productCategory, addressPostalCode, ratingAverage
  * Includes native SDKs 0.21.14 (iOS), 2.14.2 (Android).

2017-12-11  Version 2.2.0
  * Adds BranchEvent class
  * Adds new Branch Universal Object API
  * Added requiresMainQueueSetup as required by v0.49+ of RN via @UrbanChrisy (#299)
  * Fix incorrect event type when error = null via @wildseansy (#285)
  * Includes native SDKs 0.21.14 (iOS), 2.14.2 (Android).

2017-10-17  Version 2.1.1
  * Fix for +non_branch_link issue on Android (#216).
  * Suppress some warnings with Xcode 9.
  * Added a troubleshooting section to the README.
  * Includes native SDKs 0.19.5 (iOS), 2.12.2 (Android).

2017-10-02  Version 2.1.0
  * Added an openURL method for programmatic deep linking from anywhere in an app (e.g., a QR reader).
  * Allow loading rewards from different buckets via an optional argument to loadRewards().
  * Return RNBranch::Error::DuplicateResourceError in case of an existing alias.
  * Further rework of the README.
  * Introduced a tutorial app.
  * Includes native SDKs 0.19.5 (iOS), 2.12.1 (Android).

2017-08-30  Version 2.0.0
  * Added sendCommerceEvent method.
  * Complete rewrite of the README.
  * Removed the peerDependency on `react`.
  * Includes native SDKs 0.17.10 (iOS), 2.12.0 (Android).

2017-08-21  Version 2.0.0-rc.2
  * Fixed automation bug that generated an RNBranch.xcodeproj that failed with `react-native link`.
  * Regenerated RNBranch.xcodeproj to fix `react-native link` bug (#239).
  * Includes native SDKs 0.17.9 (iOS), 2.11.1 (Android).

2017-08-17  Version 2.0.0-rc.1
  * (Internal) Native SDK updates are now automated.
  * Includes native SDKs 0.17.9 (iOS), 2.11.1 (Android).

2017-08-04  Version 2.0.0-beta.8
  * Support for RN >= 0.47 (#231).
  * Added support for platform-specific branch.json.
  * Includes native SDKs 0.16.2 (iOS), 2.10.3 (Android).

2017-06-19  Version 2.0.0-beta.7
  * This release adds support for an optional `branch.json` configuration file. See https://rnbranch.app.link/branch-json for details.
  * Deprecated `[RNBranch handleDeepLink:]`. See https://rnbranch.app.link/version-2#ios-api-changes for details.
  * Includes native SDKs 0.15.3 (iOS), 2.9.0 (Android).

2017-05-30  Version 2.0.0-beta.6

  * This release adds some native wrapper methods to simplify certain native code changes that cannot
    be supported in JS.
  * Includes native SDKs 0.15.3 (iOS), 2.8.0 (Android).

2017-05-19  Version 2.0.0-beta.5

  * This release disables the unsupportable `setDebug()` method and provides new native methods to
    take its place. See https://rnbranch.app.link/hGj7E61EhD for details.
  * Removed the filter in the native layers that was passing null `params` to the `branch.subscribe` callback.
    Now `params` will never be null in the callback. Non-Branch links are
    available using the `+non_branch_link` parameter, like the rest of Branch's SDKs. See in particular the
    webview_example for updated usage. The `uri` parameter still exists, and its behavior is largely unchanged, but
    it should now be considered deprecated and will be removed in a future release.
  * Includes native SDKs 0.14.12 (iOS), 2.8.0 (Android).

2017-05-10  Version 2.0.0-beta.4

  * This release restores the React dependency to the react-native-branch podspec for full
    Swift support.
  * Improvements to webview_example_native_ios to take advantage of full Swift support.
  * Includes native SDKs 0.14.12 (iOS), 2.6.1 (Android).

2017-04-26  Version 2.0.0-beta.3

  * This release fixes an Android crash introduced in 2.0.0-beta.2. (#187)
  * Includes native SDKs 0.14.12 (iOS), 2.6.1 (Android).

2017-04-24  Version 2.0.0-beta.2

  * Implemented an RCTEventEmitter in iOS.
  * Rebuilt JS link caching to address #79.
  * Corrected link property mappings on Android (thanks to @jchesne for the PR).
  * Includes native SDKs 0.14.12 (iOS), 2.6.1 (Android).
  * Added missing AddToCartEvent, listed in the docs.
  * Export event constants from the native layer for better consistency.
  * Support for routing links in native Android apps that include RN components.
  * Added/improved example applications. The master branch includes five examples for 2.0.0:
    - testbed_simple
    - testbed_native_ios
    - testbed_native_android
    - webview_example
    - webview_native_ios
    As well as the two legacy examples testbed_carthage and testbed_cocoapods for 1.1. The
    webview_example and webview_example_native_ios apps are complete, practical examples of
    content-sharing apps that route links and follow Branch's best practices. All examples
    are fully set up for the bnctestbed.app.link domain.
  * All 2.0 examples now include support for both the test and live Branch keys. All Android
    examples will use the test key in Debug builds and the live key in Release builds. This
    is also true for testbed_simple and webview_example. testbed_native_ios and
    webview_example_native_ios use custom build configurations and schemes to differentiate
    the live and test environments (this approach is only possible when using CocoaPods on iOS;
    it is easily arranged using productFlavors on Android and very similar to the existing
    setup).
  * Added an experimental Fastlane plugin to set up example apps for iOS without using Xcode
    to make it easy to run them on a device and test link routing.
  * Greatly expanded CI and unit testing, including native unit tests, for improved stability.

2017-03-23  Version 2.0.0-beta.1

  * Reduce the number of manual steps required to get started.
  * Remove any need for CocoaPods, Carthage or manual iOS SDK installation in a React Native app.
  * Pin to specific versions of the native SDKs to avoid issues arising from version mismatches.
  * Fully support integration of react-native-branch in a React Native component within a native
    app that also uses the native Branch SDK.
  * Includes native SDKS 0.13.5 (iOS), 2.5.9 (Android)

  See [Release 2.0.0](https://github.com/BranchMetrics/react-native-branch-deep-linking/blob/master/docs/Release-2.0.0.md) for more details.

2017-03-21  Version 1.1.1

  * Decrease buildToolsVersion to 23.0.1 in build.gradle
  * Fixed broken Carthage build (#128)
  * Updated README to reflect async createBranchUniversalObject method.

2017-03-21  Version 0.9.7

  * Decrease buildToolsVersion to 23.0.1 in build.gradle

2017-03-16  Version 1.1.0

  * This release introduces a userCompletedAction() method on the Branch Universal Object. The registerView() method
  is deprecated in favor of userCompletedAction(RegisterViewEvent).
  * The createBranchUniversalObject() method now allocates native resources supporting the BUO. These are eventually
  cleaned up when unused for some time. An optional release() method is also provided to ensure they are released
  immediately, e.g. when componentWillUnmount() is called.
  * Corrected a react-native version limitation in the build.gradle to ensure the version from node_modules is used.
  * The native iOS dependencies for the testbed apps were updated to 0.13.5.

2017-03-16  Version 0.9.6

  * Corrected a react-native version limitation in the build.gradle to ensure the version from node_modules is used.

2017-02-24  Version 1.0.5

  * Improved support for manual installation of Branch SDK
  * Fix for non-Branch links with Universal Links on iOS

2017-02-24  Version 0.9.5

  * Improved support for manual installation of Branch SDK
  * Fix for non-Branch links with Universal Links on iOS

2017-02-15  Version 1.0.4

  * Reduced iOS deploy target from 9.2 to 8.0.

2017-02-15  Version 0.9.3

  * Reduced iOS deploy target from 9.2 to 8.0.

2017-02-06  Version 1.0.2

  * Corrected peerDependencies
  * Fixed [an issue](https://github.com/BranchMetrics/react-native-branch-deep-linking/pull/93) that prevented App Store submission

2017-02-06  Version 0.9.2

  * Corrected peerDependencies

2017-01-31  Version 1.0.1

  * Fixed unsubscribe bug (#73)
  * Support all parameters of Branch Universal Object and link properties

2017-01-31  Version 0.9.1

  * Fixed unsubscribe bug (#73)
  * Full support for Carthage
  * Support all parameters of Branch Universal Object and link properties

2017-01-13  Version 1.0.0

  * Support for react-native 0.40.0
  * Configuration changes to support various toolchains
  * Full support for Carthage
