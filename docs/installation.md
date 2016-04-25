# React Native Branch - Installation
1. `npm install --save react-native-branch`
2. `rnpm link react-native-branch` **or** link the project [manually](#manual-linking)
3. Add `pod 'Branch'` as a dependency in your ios/Podfile
4. `cd ios && pod install`

## Cocoa Pods
#### Example Podfile
In a standard installation your Podfile should look something like:
```
target 'MyProject' do
  pod 'Branch'
end
```

#### Creating a New Podfile
If you do not already have a Podfile in your ios directory, you can create one with `cd ios && pod init`. Then add `pod 'Branch'` to your target. The final Podfile should look something like:
```
target 'MyProject' do
  pod 'Branch'
end
```
Now run `pod install` to get the branch sdk.

After pod install you will from now on need to open your project using **[MyProject].xcworkspace** instead of the old .xcodeproj.

#### Pod Only Installation
If you already use the React cocoa-pod, you can simply add the react-native-branch dependency to your Podfile:
```
target 'MyProject' do
  pod 'React', :path => '../node_modules/react-native'
  pod 'react-native-branch', :path => '../node_modules/react-native-branch'
end
```

## Manual Linking
#### iOS:
- Drag and Drop /node_modules/react-native-branch/RNBranch/RNBranch.xcodeproj into the Libraries folder of your project in XCode (as described in Step 1 [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content))
- Drag and Drop the RNBranch.xcodeproj's Products's libRNBranch.a into your project's target's "Linked Frameworks and Libraries" section (as described in Step 2 [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content))

#### android:
android/settings.gradle
```gradle
include ':react-native-branch', ':app'

project(':react-native-branch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-branch/android')
```
android/app/build.gradle
```gradle
dependencies {
    ...
    compile project(':react-native-branch')
}
```
android/app/src/[...]/MainActivity.java
```java
import io.branch.rnbranch.*; // <-- Add this

public class MainActivity extends ReactActivity {
    // ...
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNBranchPackage() // <-- Add this
        );
    }
    // ...
}
```
