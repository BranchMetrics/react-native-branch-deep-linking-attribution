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
pod install
```

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

Add a String entry branch_key with your branch key to your plist (as described [here](https://dev.branch.io/recipes/add_the_sdk/ios/#add-your-branch-key))

#### Configure for Universal Links (optional but strongly recommended)

Please follow the [instructions](https://dev.branch.io/recipes/add_the_sdk/ios/#configure-for-universal-links)
