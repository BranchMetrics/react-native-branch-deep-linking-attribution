# Installation using CocoaPods

There are two options for integration using CocoaPods. You may use the React
pod, distributed with React Native under node_modules/react-native, or you
may just add `pod 'Branch'` to your Podfile.

The first approach is preferred because it preserves compatibility with
`react-native link` and makes updating react-native-branch simpler.
The second approach breaks `react-native link` and requires you to specify
the correct version of the Branch SDK in your Podfile, which you may have
to manually update each time you update react-native-branch.
However, the React pod as of 0.59.8 will not compile for tvOS. If your app
supports tvOS as well as iOS, using the React pod will break your tvOS build,
so for now you can't use the first method. See
https://github.com/jdee/react_native_util/issues/32 for more details.

The third option is to use [Carthage](./carthage.md).

## Prerequisites

Install CocoaPods if necessary.  
https://guides.cocoapods.org/using/getting-started.html#installation

## Installation using the React pod

If you are already using the React pod, simply:

```bash
yarn add react-native-branch
react-native link react-native-branch
```

Then run `pod install` and follow the setup instructions.

If you are not using CocoaPods in your app; your app does not support tvOS;
and you would like to convert to use the React pod, you can use the
`react_native_util react_pod` command to convert your project automatically:

https://github.com/jdee/react_native_util

For example:
```bash
brew install jdee/tap/react_native_util
cd /path/to/app
rn react_pod
git add .
git commit -m'Converted to use React pod'
```

For manual conversion instructions, please see
[Convert to React Pod](./convert-to-react-pod.md).

Once your project is converted, follow the instructions above:
```bash
yarn add react-native-branch
react-native link react-native-branch
```

The run `pod install` and follow the setup instructions.

## Installation without the React pod

This method may be simpler, but has two drawbacks. First, `react-native link`
will no longer work for iOS. Second, you need to specify the correct version of the
Branch pod in your Podfile. Whenever you update react-native-branch, you may
have to manually update your Podfile to specify the correct version. This is
not necessary when using the React pod. It is only recommended to use this
method if you have a tvOS app, since the React pod will not build for tvOS.

If you are already using CocoaPods, add this to your Podfile:

```Ruby
pod 'Branch', '0.28.1'
```

**Note:** The required version of the Branch SDK may differ. In that case,
react-native-branch will throw an error at runtime to inform you of the
correct version to add to your Podfile.

After adding the Branch pod, run `pod install`. It will also be necessary to
add node_modules/react-native-branch/ios/RNBranch.xcodeproj to the Libraries
group in your app project. See
https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking
for details. Now follow the setup instructions.

If you are not already using CocoaPods, you should first set up your app project
manually or using `pod init`. See
https://guides.cocoapods.org/using/using-cocoapods.html#creating-a-new-xcode-project-with-cocoapods.
Note that `pod init` may generate a Podfile that fails `pod install`. In that
case, use this Podfile to start with:

```Ruby
target 'MyApp' do
  # Use the actual deployment target for your iOS app target
  # or comment out the following line.
  platform :ios, '9.0'

  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # iOS dependencies
  pod 'Branch', '0.28.1'

  target 'MyAppTests' do
    # Add any additional dependencies for the test target
  end
end

target 'MyApp-tvOS' do
  # Use the actual deployment target for your tvOS app target
  # or comment out the following line.
  platform :tvos, '9.2'

  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # tvOS dependencies

  target 'MyApp-tvOSTests' do
    # Add any additional dependencies for the test target
  end
end
```

Replace `MyApp` with the name of your app and then run `pod install`. If you do
not have test targets in your app project, omit the blocks for those targets.

Note that after this conversion, if you run `react-native link` for any
dependency, it will add a line to your Podfile for a pod from node_modules
instead of adding an Xcode project from node_modules to the Libraries group
in your app. These pods all depend on the React pod, which was discontinued
from CocoaPods. The last production release to CocoaPods was RN 0.11. Without
properly setting up the React pod as above, `pod install` will quietly pull in
a very old version of the React pod, which will cause build problems. It will
no longer be possible to use `react-native link` to add dependencies to your
Xcode project. You'll have to do it by hand for each new dependency. You'll
find manual instructions here:
https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking.
