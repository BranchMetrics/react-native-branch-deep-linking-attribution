# react-native-branch
Native Wrapper around Branch Metrics native SDKs. Tested with React Native 0.18.1 and branch 0.11.14. 

Android support to come shortly.

## Usage

```js
var branch = require('react-native-branch');

//Receives the initSession's result as soon as it becomes available
branch.getInitSessionResultPatiently(({params, error}) => { });

branch.setDebug();
branch.getLatestReferringParams((params) => { });
branch.getFirstReferringParams((params) => { });
branch.setIdentity("Your User's ID");
branch.userCompletedAction("Purchased Item", {item: 123});
branch.logout();
```

## Installation

```sh
npm install rnpm -g
npm install --save react-native-branch
rnpm link react-native-branch
cd node_modules/react-native-branch
pod install #Only required for iOS
```

### Android

#### Step 0 - Verify Library Linking

*Sometimes rnpm link creates incorrect relative paths, leading to compilation errors*

*Ensure that the following files look as described and all linked paths are correct*

```gradle
// file: android/settings.gradle
...

include ':react-native-branch', ':app'
project(':react-native-branch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-branch/android')
```

```gradle
// file: android/app/build.gradle
...

dependencies {
    ...
    compile project(':react-native-branch')
}
```

#### Step 1 - Initialize the RNBranchModule

```java
// file: android/app/src/main/java/com/xxx/MainActivity.java

import com.dispatcher.rnbranch.*; // <-- import

public class MainActivity extends ReactActivity {
    // ...

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNBranchPackage() // <-- add this line, if not already there
        );
    }
    
    // Add onStart
    @Override
    public void onStart() {
        super.onStart();

        RNBranchModule.initSession(this.getIntent().getData(), this);
    }
    
    // Add onNewIntent
    @Override
    public void onNewIntent(Intent intent) {
        this.setIntent(intent);
    }
    
    // ...  
} 
```

#### Step 2 - Configure Manifest

Please follow [these instructions] (https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#configure-manifest)

#### Step 3 - Register for Google Play Install Referrer

Please follow [these instructions](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-for-google-play-install-referrer)

Note: The "receiver" element needs to be added to the "application" node in AndroidManifest.xml

#### Step 4 - Register a URI scheme

Please follow [these instructions](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-a-uri-scheme)

Notes:
- The "intent-filter" element needs to be added to the activity node, whose android:name is "com.yourAppName.MainActivity". This node is in the "application" node.
- Make sure to replace "yourApp" with the scheme you specified in the Branch dashboard.

#### Step 5 - Enable Auto Session Management

Please follow [these instructions](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#enable-auto-session-management)

Note: Just add the "android:name" attribute to your "application" node in your AndroidManifest.xml

#### Step 6 - Enable App Links for Android M and above (Optional but Recommended)

Please follow [these instructions](https://dev.branch.io/getting-started/universal-app-links/guide/android/)

### iOS

#### Modifications to your React Native XCode Project

- Drag and Drop /node_modules/react-native-branch/Pods/Pods.xcodeproj into the Libraries folder of your project in XCode (as described in Step 1 [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content))
- Drag and Drop the Pods.xcodeproj's Products's libBranch.a into your project's target's "Linked Frameworks and Libraries" section (as described in Step 2 [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content))



#### Modifications to AppDelegate.m

Import RNBranch.h at the top

```objective-c
#import "RNBranch.h"
```


Initialize the Branch Session in didFinishLaunchingWithOptions

```objective-c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  NSURL *jsCodeLocation;
  ///
}
```

Add the openURL and continueUserActivity functions

```objective-c
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  if (![RNBranch handleDeepLink:url]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
  }
  return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}
```

#### Add the branch_key to your plist

Add a String entry branch_key with your branch key to your plist (as described [here](https://dev.branch.io/references/ios_sdk/#add-your-branch-key-to-your-project))

#### Register a URI Scheme for Direct Deep Linking (Optional but Recommended)

Please follow these instructions [here](https://dev.branch.io/references/ios_sdk/#register-a-uri-scheme-direct-deep-linking-optional-but-recommended)

#### Configure for Universal Links

Please follow these instructions [here](https://dev.branch.io/references/ios_sdk/#support-universal-linking-ios-9)
