# Installation using Carthage

Carthage requires version 3.0.1 of react-native-branch.

Add react-native-branch to your project:

```bash
yarn add react-native-branch
react-native link react-native-branch
```

If you already have a Cartfile, add this to your Cartfile:

```
github "BranchMetrics/ios-branch-deep-linking" "0.28.1"
```

Now run `carthage build`.

**Note:** The required version of the Branch SDK may differ. In that case,
react-native-branch will throw an error at runtime to inform you of the
correct version to add to your Cartfile.

If you don't have a Cartfile, create a file called Cartfile in the ios
subdirectory containing the line above.

Now run `carthage bootstrap`.

After running `carthage build|bootstrap`, the Branch framework will be found in
Carthage/Build/iOS. Drag it into the Frameworks group in your project or add it
to that group using Xcode.
