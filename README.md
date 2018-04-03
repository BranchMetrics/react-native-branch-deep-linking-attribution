# Branch Metrics React Native SDK Reference

[![CircleCI](https://circleci.com/gh/BranchMetrics/react-native-branch-deep-linking.svg?style=svg)](https://circleci.com/gh/BranchMetrics/react-native-branch-deep-linking)
[![Travis](https://img.shields.io/travis/BranchMetrics/react-native-branch-deep-linking.svg?style=flat)](https://travis-ci.org/BranchMetrics/react-native-branch-deep-linking)
[![npm version](https://img.shields.io/npm/v/react-native-branch.svg?style=flat)](https://www.npmjs.com/package/react-native-branch)
[![npm downloads](https://img.shields.io/npm/dm/react-native-branch.svg?style=flat)](https://www.npmjs.com/package/react-native-branch)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/BranchMetrics/react-native-branch-deep-linking/master/LICENSE)

This is a repository of our open source React Native SDK. The information presented here serves as a reference manual for the SDK. See the table of contents below for a complete list of the content featured in this document.

___

## React Native Reference

1. External resources
  + [Full integration guide](https://docs.branch.io/pages/apps/react-native/)
  + [Change log](https://github.com/BranchMetrics/react-native-branch-deep-linking/blob/master/ChangeLog.md)
  + [Support portal](http://support.branch.io)

2. Getting started
  + [Installation using react-native link](#pure-react-native-app-using-react-native-link)
  + [Installation in a native iOS app using the React pod](#native-ios-app-using-the-react-pod)
  + [Updating from an earlier SDK version](#updating-from-an-earlier-version)
  + [Register for Branch key](#register-your-app)
  + [Project setup](#setup)
  + [Example apps](#example-apps)

3. Branch general methods
  + [Register a subscriber](#register-a-subscriber)
  + [Unregister a subscriber](#unregister-a-subscriber)
  + [Skip cached initial launch event](#skip-cached-initial-launch-event)
  + [Retrieve latest deep linking params](#retrieve-session-install-or-open-parameters)
  + [Retrieve the user's first deep linking params](#retrieve-session-install-or-open-params)
  + [Setting the user id for tracking influencers](#persistent-identities)
  + [Logging a user out](#logout)
  + [Tracking user actions and events](#tracking-user-actions-and-events)
  + [Programmatic deep linking](#programmatic-deep-linking)
  + [Debug mode and Apple Search Ads attribution](#debug-mode-and-apple-search-ads-attribution)

4. Branch Universal Objects
  + [Instantiate a Branch Universal Object](#create-branch-universal-object)
  + [Register user actions on an object](#register-user-actions-on-an-object)
  + [List content on Spotlight](#list-content-on-spotlight)
  + [Configuring link properties](#link-properties-parameters)
  + [Configuring control parameters](#control-parameters)
  + [Creating a short link referencing the object](#shortened-links)
  + [Triggering a share sheet to share a link](#share-sheet)
  + [Releasing native resources](#releasing-native-resources)

5. Referral rewards methods
  + [Get reward balance](#get-reward-balance)
  + [Redeem rewards](#redeem-all-or-some-of-the-reward-balance-store-state)
  + [Get credit history](#get-credit-history)

6. General support
  + [Troubleshooting](#troubleshooting)

## Installation

Note that the `react-native-branch` module requires `react-native` >= 0.40.

### Pure React Native app (using react-native link)

1. `yarn add react-native-branch` or `npm install --save react-native-branch`
2. (Optional) Add a branch.json file to the root of your app project. See https://rnbranch.app.link/branch-json.
3. `react-native link react-native-branch`
4. Follow the [setup instructions](#setup).

___

### Native iOS app using the React pod

Only follow these instructions if you are already using the React pod from node_modules. This is usually
done in native apps that integrate a React Native components.

1. Add the following to your Podfile:
    ```Ruby
    pod "react-native-branch", path: "../node_modules/react-native-branch"
    pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"
    ```
    Adjust the path if necessary to indicate the location of your `node_modules` subdirectory.
2. Run `pod install` to regenerate the Pods project with these new dependencies.
2. (Optional) Add a branch.json file to your app project. See https://rnbranch.app.link/branch-json.
4. Follow the [setup instructions](#setup).

___

### Updating from an earlier version

As of version 2.0.0, the native Branch SDKs are included in the module and must not be installed
from elsewhere (CocoaPods, Carthage or manually). When updating from an earlier
version of `react-native-branch`, you must remove the Branch SDK that was
previously taken from elsewhere.

#### Android

Open the `android/app/build.gradle` file
in your project. Remove:

```gradle
compile 'io.branch.sdk.android:library:2.+'
```

And add this line if not already present:

```gradle
compile fileTree(dir: 'libs', include: ['*.jar'])
```

The result should be something like
```gradle
dependencies {
    compile project(':react-native-branch')
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile "com.android.support:appcompat-v7:23.0.1"
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

#### iOS

Remove the external Branch SDK from your project depending on how you originally
integrated it.

##### CocoaPods

###### Apps built using react-native link

Remove "Branch" from your Podfile. Run `pod install` after updating the Podfile. This is
necessary to regenerate the Pods project without the Branch pod.

If you added CocoaPods to your project just for the Branch pod, you can remove CocoaPods entirely from your app using the [pod deintegrate](https://guides.cocoapods.org/terminal/commands.html#pod_deintegrate) command.

###### Using the React pod

Replace `pod "Branch"` in your Podfile with `pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"`.
```Ruby
pod "React", path: "../node_modules/react-native"
# The following line is necessary with use_frameworks! or RN >= 0.42.
pod "Yoga", path: "../node_modules/react-native/ReactCommon/yoga"
pod "react-native-branch", path: "../node_modules/react-native-branch"
pod "Branch-SDK", path: "../node_modules/react-native-branch/ios"
```

The location of `node_modules` relative to your `Podfile` may vary.

Run `pod install` after making this change.

##### Carthage

Remove Branch.framework from your app's dependencies. Also remove Branch.framework from your `carthage copy-frameworks` build phase.

##### Manually installed

Remove Branch.framework from your app's dependencies.

___

### Register Your App

You can sign up for your own app id at [https://dashboard.branch.io](https://dashboard.branch.io).

___

## Setup

- [iOS Setup](#ios-setup)
- [Android Setup](#android-setup)

### iOS Setup

Modify your AppDelegate as follows:

#### Objective-C
In AppDelegate.m

```objective-c
#import <react-native-branch/RNBranch.h> // at the top

// Initialize the Branch Session at the top of existing application:didFinishLaunchingWithOptions:
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Uncomment this line to use the test key instead of the live one.
    // [RNBranch useTestInstance]
    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this

    NSURL *jsCodeLocation;
    //...
}

// Add the openURL and continueUserActivity functions
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    if (![RNBranch.branch application:app openURL:url options:options]) {
        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    return [RNBranch continueUserActivity:userActivity];
}
```

Note: Some applications may use `application:openURL:sourceApplication:annotiation:` instead of `application:openURL:options:`.

```objective-c
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    if (![RNBranch.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]) {
        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    }
    return YES;
}
```

If you do not yet have either method in your app, prefer the first (`application:openURL:options:`), which
will be supplied by autocompletion in Xcode.

#### Swift

If you are using `react-native link`, your AppDelegate is probably written in Objective-C. When you use
`react-native link`, the Branch dependency is added to your project as a static library. If instead
you are using Swift in a pure React Native app with `react-native link`, you will require a
[bridging header](https://developer.apple.com/library/content/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html)
in order to use any React Native plugin in Swift.

Add `#import <react-native-branch/RNBranch.h>` to your Bridging header if you have one.

If you are using the `React` pod in a native app with `use_frameworks!`, you may simply use
a Swift import:

```Swift
import react_native_branch
```

In AppDelegate.swift:
```Swift
// Initialize the Branch Session at the top of existing application:didFinishLaunchingWithOptions:
func application(_ application: UIApplication, didFinishLaunchingWithOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    // Uncomment this line to use the test key instead of the live one.
    // RNBranch.useTestInstance()
    RNBranch.initSession(launchOptions: launchOptions, isReferrable: true) // <-- add this

    //...
}

// Add the openURL and continueUserActivity functions
func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
    return RNBranch.branch.application(app, open: url, options: options)
}

func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
    return RNBranch.continue(userActivity)
}
```

These instructions are for Swift 3 and 4.

### iOS Project Configuration

After modifying your AppDelegate:

1. [Add a Dictionary or String entry branch_key](https://dev.branch.io/references/ios_sdk/#add-your-branch-key-to-your-project) with your Branch key to your info.plist

2. [Configure for Universal Linking](https://dev.branch.io/references/ios_sdk/#support-universal-linking-ios-9)

3. If using a custom domain in the Branch Dashboard or one or more non-Branch domains, [add the `branch_universal_link_domains`
    key to your Info.plist](https://dev.branch.io/getting-started/universal-app-links/advanced/ios/#custom-continueuseractivity-configuration).

___

### Android Setup

Add RNBranchPackage to packages list in `getPackages()` MainApplication.java (`android/app/src/[...]/MainApplication.java`).
Note that this is automatically done if you used `react-native link`.

Also add a call to `Branch.getAutoinstance()` in `onCreate()` in the same source file. This has to be
done even if you used `react-native link`.
```java
// ...

// import Branch and RNBranch
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;

//...

    // add RNBranchPackage to react-native package list
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RNBranchPackage(), // <-- add this

    // ...

    // add onCreate() override
    @Override
    public void onCreate() {
      super.onCreate();
      Branch.getAutoInstance(this);
    }
```

Override onStart and onNewIntent in MainActivity.java to handle Branch links (`android/app/src/[...]/MainActivity.java`).
This has to be done regardless whether you used `react-native link`.
```java
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "base";
    }

    // Override onStart, onNewIntent:
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);
    }
    // ...
}
```

### Android Project Configuration

1. [Configure AndroidManifest.xml](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#configure-manifest). Be sure to set `android:launchMode="singleTask"` on your main activity.

2. [Register for Google Play Install Referrer](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-for-google-play-install-referrer). The "receiver" element needs to be added to the "application" node in AndroidManifest.xml

3. [Register a URI scheme](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-a-uri-scheme)
- The "intent-filter" element needs to be added to the activity node, whose android:name is "com.yourAppName.MainActivity". This node is in the "application" node.
- If you already have an intent-filter tag, this has to be added as an additional one.
- Make sure to replace "yourApp" with the scheme you specified in the Branch dashboard.

4. [Enable Auto Session Management](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#enable-auto-session-management). Simply add the "android:name" attribute to your "application" node in your AndroidManifest.xml

5. [Enable App Links for Android M and above](https://dev.branch.io/getting-started/universal-app-links/guide/android/) (optional but recommended)

6. Add your Branch key to AndroidManifest: Inside of application node add `<meta-data android:name="io.branch.sdk.BranchKey" android:value="your_branch_key" />`

7. Add the following to your `android/app/proguard-rules.pro` file:

```
-dontwarn io.branch.**
```

Please see the Branch [SDK Integration Guide](https://dev.branch.io/getting-started/sdk-integration-guide/) for complete setup instructions.

___

## Example apps

There are six example apps in this repo, including a [tutorial app](./examples/webview_tutorial).
See the [examples](./examples) subdirectory for more details.

___

## SDK Documentation

### Register a subscriber

To be called back when a link is opened, register a subscriber callback function
using the `branch.subscribe` method. Note that unlike the underlying native SDKs,
you do not have to initialize the Branch session from JavaScript. This is done
in native code at app launch, before the JavaScript initializes. If the app was
opened from a link, the initial link is cached by the native layer and returned
to the JavaScript subscriber afterward. This method may be called repeatedly in
different app components. To route links in a pure React Native app, call this
method in `componentDidMount` in a component that is mounted at app launch.

In a native app that includes a React Native component, link routing will usually
be done at the native level. This method may still be called from
JavaScript for purposes other than link routing (e.g. custom analytics). Other
Branch SDK methods may be called in this case without calling `branch.subscribe`
at all in JavaScript.

The callback function you supply to the `branch.subscribe` method is called
whenever a link is opened and at certain other times, such as successful SDK
initialization without a deferred deep link.

#### Method

```js
branch.subscribe(listener)
```

##### Parameters

**listener**: A function taking an object argument with the shape `{ error, params }`.
The `error` argument is a string. The `params` argument is an object. See
[Params object](#params-object) for details on the contents.

##### Return

The return value of `branch.subscribe` is a function that cancels the subscription
when called.

#### Example

```js
import branch from 'react-native-branch'

branch.subscribe(({ error, params }) => {
  if (error) {
    console.error('Error from Branch: ' + error)
    return
  }

  // params will never be null if error is null

  if (params['+non_branch_link']) {
    const nonBranchUrl = params['+non_branch_link']
    // Route non-Branch URL if appropriate.
    return
  }

  if (!params['+clicked_branch_link']) {
    // Indicates initialization success and some other conditions.
    // No link was opened.
    return
  }

  // A Branch link was opened.
  // Route link based on data in params.
})
```

___

### Unregister a subscriber

The return value of `branch.subscribe` is a function that cancels the
subscription when called. Call this in `componentWillUnmount`.

#### Example

```js
import branch from 'react-native-branch'

class MyApp extends Component {
  _unsubscribeFromBranch = null

  componentDidMount() {
    _unsubscribeFromBranch = branch.subscribe({ error, params } => {
      // ...
    })
  }

  componentWillUnmount() {
    if (_unsubscribeFromBranch) {
      _unsubscribeFromBranch()
      _unsubscribeFromBranch = null
    }
  }
}
```

___

### Skip cached initial launch event

Any initial link cached by the native layer will be returned to the callback
supplied to `branch.subscribe` immediately if the JavaScript method is called
for the first time after app launch. In case, app does not need to receive
the cached initial app launch link event, call `branch.skipCachedEvents()`
before `branch.subscribe` to skip returning it.

#### Method

```js
branch.skipCachedEvents()
```

Also, if a cached initial app launch link event is returned, `params` will
contain a key `cached_initial_event`, set to `true`.

#### Example

```js
import branch from 'react-native-branch'

branch.skipCachedEvents()
branch.subscribe({ error, params } => {
  // ...
})
```

```js
import branch from 'react-native-branch'

branch.subscribe({ error, params } => {
  if ('cached_initial_event' in params) {
    // ...
  }
})
```

___

### Retrieve session (install or open) params

These session parameters will be available at any point later on with this command. If no parameters are available then Branch will return an empty dictionary. This refreshes with every new session (app installs AND app opens).

#### Method

```js
branch.getLatestReferringParams()
```

##### Return

A promise. On resolution, the promise returns an object containing the parameters
from the latest link open or install. See [Params object](#params-object) for
details on the contents.

#### Example

```js
import branch from 'react-native-branch'

const latestParams = await branch.getLatestReferringParams()
```

___

### Retrieve Install (Install Only) Parameters

If you ever want to access the original session params (the parameters passed in for the first install event only), you can use this line. This is useful if you only want to reward users who newly installed the app from a referral link. Note that these parameters can be updated when `setIdentity:` is called and identity merging occurs.

#### Method

```js
branch.getFirstReferringParams()
```

##### Return

A promise. On resolution, the promise returns an object containing the referring
parameters from the initial app installation. See [Params object](#params-object)
for details on the contents.

#### Example

```js
import branch from 'react-native-branch'

const latestParams = await branch.getFirstReferringParams()
```

___

### Persistent Identities

Often, you might have your own user IDs, or want referral and event data to persist across platforms or uninstall/reinstall. It's helpful if you know your users access your service from different devices. This where we introduce the concept of an 'identity'.

#### Method

```js
branch.setIdentity(userIdentity)
```

##### Parameters

**userIdentity**: A string specifying the user identity to use.

#### Example

```js
import branch from 'react-native-branch'

branch.setIdentity('theUserId')
```

___

### Logout

If you provide a logout function in your app, be sure to clear the user when the logout completes. This will ensure that all the stored parameters get cleared and all events are properly attributed to the right identity.

**Warning**: This call will clear the promo credits and attribution on the device.

#### Method

```js
branch.logout()
```

#### Example

```js
import branch from 'react-native-branch'

branch.logout()
```

___

### Programmatic deep linking

The Branch SDK automatically triggers the `branch.subscribe` callback whenever a
link is received in the app via App Links, Universal Links or custom URI schemes.
There may be other cases where you want to trigger a link open programmatically,
e.g. from a push notification or a QR reader. Use the `branch.openURL` method
to trigger an open of a Branch link from anywhere in your app. In the case of
native apps integrating an RN component, this will also trigger the native
deep link handler callback.

**Note**: This method does nothing if passed a link that is not recognized by
the SDK. Non-Branch links may be passed for any domain that is configured for the
app. This method does not pass the URL to the operating system or a browser.

**Android note**: If not using the `newActivity` option, it is necessary to move
the call to the `RNBranch.initSession` method to the main activity's `onResume`
method instead of `onStart`:

```java
@Override
protected void onResume() {
  super.onResume();
  RNBranch.initSession(getIntent().getData(), this);
}
```

#### Method

```js
branch.openURL(url, options)
```

##### Parameters

**url**: A String containing a Branch link  
**options**: (Optional) An object with keys to supply option values (see below)

##### Options

**newActivity**: (Android) Finish the current activity before opening the link.
Results in a new activity window. Ignored on iOS.

#### Example

```js
import branch from 'react-native-branch'

branch.openURL("https://myapp.app.link/xyz")
branch.openURL("https://myapp.app.link/xyz", {newActivity: true})
```

___

### Tracking User Actions and Events

Use the `BranchEvent` interface to track special user actions or application specific events beyond app installs, opens, and sharing. You can track events such as when a user adds an item to an on-line shopping cart, or searches for a keyword, among others.

The `BranchEvent` interface provides an interface to add contents represented by BranchUniversalObject in order to associate app contents with events.

Analytics about your app's BranchEvents can be found on the Branch dashboard, and BranchEvents also provide tight integration with many third party analytics providers.

*Note:* The BranchEvent class supersedes the `userCompletedAction` method on the
Branch Universal Object and the `branch.sendCommerceEvent` method, both of which
should be considered deprecated.

#### Constructor

```js
new BranchEvent(name, contentItems = null, params = {})
```

#### Parameters

**name**: String indicating the name of the event to log. Pass a standard event
    constant, such as `BranchEvent.ViewItem` or a custom event name.  
**contentItems**: Zero or more Branch Universal Objects associated with this
    event. Pass null, a single Branch Universal Object or an array of them.  
**params**: Optional Object with properties to be set on the BranchEvent (see below).

#### Properties

The following properties may be passed as arguments to the constructor or
set directly on the object after construction.

**name:** A string indicating the name of the event, as passed to the constructor.
    May be set after construction.  
**contentItems:** An array of Branch Universal Objects associated with this
    event. May be empty. Contents may be adjusted after construction.

The following properties may be passed to the constructor in the `params` or
set directly on the object after construction.

**transactionID**: String indicating a transaction ID  
**currency**: An ISO currency code (e.g. USD, JPY, EUR)  
**revenue**: Revenue associated with this event as a string or number  
**shipping**: Shipping cost associated with this event as a string or number  
**tax**: Tax associated with this event as a string or number  
**coupon**: String indicating a coupon code for this event  
**affiliation**: String indicating an affiliation for this event  
**description**: String indicating a description for this event  
**searchQuery**: String indicating a search query for this event  
**customData**: Object containing arbitrary key-value pairs for this event.
    Values must be strings.

#### logEvent method

```js
branchEvent.logEvent()
```

Logs a BranchEvent with all associated parameters.

#### Examples

Log a view on a single Branch Universal Object.

```js
new BranchEvent(BranchEvent.ViewItem, buo).logEvent()
```

Log a view on a multiple Branch Universal Objects.

```js
new BranchEvent(BranchEvent.ViewItems, [buo1, buo2]).logEvent()
```

Log a Purchase event on a Branch Universal Object.

```js
new BranchEvent(BranchEvent.Purchase, buo, {
  revenue: 20,
  shipping: 2,
  tax: 1.6,
  currency: 'USD'}).logEvent()
```

Log a Search event.

```js
let event = new BranchEvent(BranchEvent.Search)
event.searchQuery = "tennis rackets"
event.logEvent()
```

Log a custom event.

```js
new BranchEvent("UserScannedItem", buo).logEvent()
```

When logging an event on a single Branch Universal Object, the `logEvent`
method may be called on the Branch Universal Object.

```js
buo.logEvent(BranchEvent.Purchase, { revenue: 20 })
```

This is equivalent to

```js
new BranchEvent(BranchEvent.Purchase, buo, { revenue: 20 }).logEvent()
```

#### Standard events

|Event constant|Description|
|--------------|-----------|
|BranchEvent.AddToCart|Standard Add to Cart event|
|BranchEvent.AddToWishlist|Standard Add to Wishlist event|
|BranchEvent.ViewCart|Standard View Cart event|
|BranchEvent.InitiatePurchase|Standard Initiate Purchase event|
|BranchEvent.AddPaymentInfo|Standard Add Payment Info event|
|BranchEvent.Purchase|Standard Purchase event|
|BranchEvent.SpendCredits|Standard Spend Credits event|
|BranchEvent.Search|Standard Search event|
|BranchEvent.ViewItem|Standard View Item event for a single Branch Universal Object|
|BranchEvent.ViewItems|Standard View Items event for multiple Branch Universal Objects|
|BranchEvent.Rate|Standard Rate event|
|BranchEvent.Share|Standard Share event|
|BranchEvent.CompleteRegistration|Standard Complete Registration event|
|BranchEvent.CompleteTutorial|Standard Complete Tutorial event|
|BranchEvent.AchieveLevel|Standard Achieve Level event|
|BranchEvent.AchievementUnlocked|Standard Unlock Achievement event|

___

### Debug mode and Apple Search Ads attribution

Certain methods in the native SDKs cannot be easily exposed to JavaScript, because
they must be called before the native SDKs initialize, which happens well before
JavaScript finishes loading. To use these methods, two options are available.

- Add a [branch.json](./docs/branch.json.md) file to your project.

    This allows you to enable debug mode (to simulate install events on both
    Android and iOS), Apple Search Ads attribution and Apple Search Ads debug
    mode from a configuration file.

- Add native iOS and Android method calls to your project.

    + [Debug mode (simulated install events)](./docs/setDebug.md)
    + [Apple Search Ads attribution](https://github.com/BranchMetrics/ios-branch-deep-linking#apple-search-ads)

___


## Referral System Rewarding Functionality

### Get Reward Balance

Reward balances change randomly on the backend when certain actions are taken (defined by your rules), so
you will need to make an asynchronous call to retrieve the balance.

#### Method

```js
branch.loadRewards(bucket)
```

##### Parameters

**bucket**: (Optional) The bucket to get the credit balance for

##### Return

#### Example

```js
import branch from 'react-native-branch'

let rewards = await branch.loadRewards(bucket)
```

___

### Redeem All or Some of the Reward Balance (Store State)

Redeeming credits allows users to cash in the credits they've earned. Upon successful redemption, the user's balance will be updated reflecting the deduction.

#### Method

```js
branch.redeemRewards(amount, bucket)
```

##### Parameters

**amount**: The amount to redeem  
**bucket**: (Optional) The bucket to redeem from

#### Example

```js
import branch from 'react-native-branch'

let redeemResult = await branch.redeemRewards(amount, bucket)
```

___

### Get Credit History

This call will retrieve the entire history of credits and redemptions from the individual user.

#### Method

```js
branch.getCreditHistory()
```

##### Return

A promise. On resolution, the promise returns an array containing the current user's credit history.

#### Example

```js
let creditHistory = await branch.getCreditHistory()
```

___

## Branch Universal Object (for deep links, content analytics and indexing)

The Branch Universal Object represents an item of content in your app, e.g. an article,
a video, a user profile or a post.

### Branch Universal Object best practices

Here are a set of best practices to ensure that your analytics are correct, and your content is ranking on Spotlight effectively.

1. Set the `canonicalIdentifier` to a unique, de-duped value across instances of the app.
2. Ensure that the `title`, `contentDescription` and `contentImageUrl` properly represent the object.
3. Initialize the Branch Universal Object and call `logEvent(BranchEvent.ViewItem)` **on page load** (in `componentDidMount`).
4. Call `showShareSheet` and `generateShortLink` later in the life cycle, when the user takes an action that needs a link.
5. Call the additional object events (purchase, share completed, etc) when the corresponding user action is taken.

Practices to _avoid_:
1. Don't set the same `title`, `contentDescription` and `contentImageUrl` across all objects.
2. Don't wait to initialize the object and register views until the user goes to share.
3. Don't wait to initialize the object until you conveniently need a link.
4. Don't create many objects at once and register views in a loop.

___

### Create Branch Universal Object

To create a Branch Universal Object, use the `branch.createBranchUniversalObject` method. Note
that unlike the underlying SDKs, all parameters to the Branch Universal Object must be supplied
at creation. These parameters are not represented as properties on the JavaScript object
returned by this method. They are stored on the underlying native Branch Universal Object.

#### Method

```js
branch.createBranchUniversalObject(canonicalIdentifier, properties)
```

##### Parameters

**canonicalIdentifier**: A string that uniquely identifies this item of content  
**properties**: An object containing properties defining the Branch Universal Object. See
[Branch Universal Object Properties](#branch-universal-object-properties) for a list of
available properties.

##### Return

A promise. On resolution, the promise returns an object with a number of methods, documented
below.

#### Example

```js
import branch from 'react-native-branch'

let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
  locallyIndex: true,
  title: 'Cool Content!',
  contentDescription: 'Cool Content Description'}),
  contentMetadata: {
    ratingAverage: 4.2,
    ratingCount: 100,
    ratingMax: 5.0,
    customMetadata: {
      prop1: 'test',
      prop2: 'abc'
    }
  }
})
```

___

### Register user actions on an object

The `logEvent` method on the Branch Universal Object is a convenient shortcut
for logging a `BranchEvent` on a single Branch Universal Object. See
[Tracking user actions and events](#tracking-user-actions-and-events) for
more details on `BranchEvent`.

#### Method

```js
branchUniversalObject.logEvent(name, params = {})
```

#### Parameters

**name**: A string indicating the name of the event. May be a standard event
    defined on `BranchEvent` or a custom event name.  
**params**: An optional Object containing parameters for the `BranchEvent`

#### Examples

```js
branchUniversalObject.logEvent(BranchEvent.ViewItem)
```

```js
branchUniversalObject.logEvent(BranchEvent.Purchase, {
  revenue: 20,
  shipping: 2,
  tax: 1.6,
  currency: 'USD'
})
```

### List content on Spotlight

To list content on Spotlight, set the `locallyIndex` property to true and log a
`BranchEvent.ViewItem` or `BranchEvent.ViewItems` event.

**Note**: Listing on Spotlight requires adding `CoreSpotlight.framework` to your
Xcode project.

Note that the `automaticallyListOnSpotlight` property and the `listOnSpotlight()`
method are deprecated in favor of this mechanism.

#### Example

```js
import branch, { RegisterViewEvent } from 'react-native-branch'

let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
  locallyIndex: true,
  // other properties
})

branchUniversalObject.logEvent(BranchEvent.ViewItem)
```

___

### Shortened Links

Once you've created your `Branch Universal Object`, which is the reference to the content you're interested in, you can then get a link back to it with the mechanisms described below.

#### Method

```js
branchUniversalObject.generateShortUrl(linkProperties, controlParams)
```

##### Parameters

**linkProperties**: An object containing properties to define the link. See [Link
Properties Parameters](#link-properties-parameters) for available properties.  
**controlParams**: (Optional) An object containing control parameters to override
redirects specified in the Branch Dashboard. See
[Control Parameters](#control-parameters) for a list of available parameters.

##### Return

A promise. On resolution, the promise returns an object with the shape `{ url }`.
The `url` property is a string containing the generated short URL.

#### Example

```js
import branch from `react-native-branch`

let branchUniversalObject = await branch.createBranchUniversalObject(...)

let linkProperties = { feature: 'share', channel: 'RNApp' }
let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }

let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
```

___

### Share sheet

Once you've created your `Branch Universal Object`, which is the reference to the
content you're interested in, you can then automatically share it _without having
to create a link_ using the mechanism below.

The Branch SDK includes a wrapper around the system share sheet that will generate a
Branch short URL and automatically tag it with the channel the user selects
(Facebook, Twitter, etc.). Note that certain channels restrict access to certain
fields. For example, Facebook prohibits you from pre-populating a message.

#### Method

```js
branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
```

##### Parameters

**shareOptions*: An object containing any of the following properties:

|        KEY         |   TYPE   |       MEANING
| ------------------ | -------- | --------------------
| messageHeader      | `string` | The header text
| messageBody        | `string` | The body text
| emailSubject       | `string` | The subject of the email channel if selected

**linkProperties**: An object containing properties to define the link. See [Link
Properties Parameters](#link-properties-parameters) for available properties.  
**controlParams**: (Optional) An object containing control parameters to override
redirects specified in the Branch Dashboard. See
[Control Parameters](#control-parameters) for a list of available parameters.

##### Return

A promise. On resolution, the promise returns an object with the shape
`{ channel, completed, error }`. The `completed` property is a boolean specifying
whether the operation was completed by the user. The `channel` property is a
string specifying the share channel selected by the user. The `error` property
is a string. If non-null, it specifies any error that occurred.

#### Example

```js
import branch from `react-native-branch`

let branchUniversalObject = await branch.createBranchUniversalObject(...)

let linkProperties = { feature: 'share', channel: 'RNApp' }
let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }

let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }

let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
```

___

### Releasing native resources

The Branch Universal Object is a construct in the underlying native SDK that is
exposed using a JavaScript object that is returned by the
`createBranchUniversalObject` method. For best performance, call the `release()`
method on the Branch UniversalObject when the Branch Universal Object is no
longer in use. Native resources will eventually be reclaimed without calling
this method. Calling it ensures that the resources are reclaimed promptly.

#### Method

```js
branchUniversalObject.release()
```

#### Example

```js
import branch, { BranchEvent } from `react-native-branch

class CustomComponent extends Component {
  buo = null

  componentDidMount() {
    this.buo = await branch.createBranchUniversalObject(...)
    this.buo.logeEvent(BranchEvent.ViewItem)
  }

  componentWillUnmount() {
    if (this.buo) {
      this.buo.release()
      this.buo = null
    }
  }
}
```

___

#### Branch Universal Object Properties

|         Key                  | TYPE   |             DESCRIPTION                                |
| ---------------------------- | ------ | ------------------------------------------------------ |
| automaticallyListOnSpotlight (deprecated) | Bool   | List this item on Spotlight (iOS). Ignored on Android. **Deprecated.** Please use locallyIndex instead. |
| canonicalIdentifier          | String | The object identifier                                  |
| contentDescription           | String | Object Description                                     |
| contentImageUrl              | String | The Image URL                                          |
| contentIndexingMode (deprecated) | String | Indexing Mode 'private' or 'public' **Deprecated.** Please use locallyIndex and publiclyIndex instead. |
| contentMetadata              | Object | See [Branch Universal Object Content Metadata](#branch-universal-object-content-metadata) |
| currency (deprecated)        | String | A 3-letter ISO currency code (used with price) **Deprecated.** Please use contentMetadata.currency instead. |
| expirationDate               | String | A UTC expiration date, e.g. 2018-02-01T00:00:00        |
| keywords                     | Array  | An array of keyword strings                            |
| locallyIndex                 | Bool   | List this item on Spotlight (iOS). No current Android implementation. |
| metadata (deprecated)        | Object | Custom key/value. **Deprecated.** Please use contentMetadata.customMetadata instead. |
| price (deprecated)           | Float  | A floating-point price (used with currency) **Deprecated.** Please use contentMetadata.price instead. |
| publiclyIndex                | Bool   | List in a public search index.                         |
| title                        | String | The object title                                       |
| type (deprecated)            | String | MIME type for this content **Deprecated.** Please use contentMetadata.contentSchema instead.|

___

#### Branch Universal Object Content Metadata

| Key | TYPE | DESCRIPTION |
| --- | ---- | ----------- |
| contentSchema | String | See [Content Schema](#content-schema) |
| quantity | Number | Item quantity |
| price | String/Number | Used with currency |
| currency | String | An ISO currency code. Must also specify price. |
| sku | String | Product SKU |
| productName | String | Product name |
| productBrand | String | Product brand |
| productCategory | String | See [Product Category](#product-category) |
| productVariant | String | Product variant |
| condition | String | See [Condition](#condition) |
| ratingAverage | Number | Average rating |
| ratingCount | Number | Rating count |
| ratingMax | Number | Maximum rating |
| addressStreet | String | Address street |
| addressCity | String | Address city |
| addressRegion | String | Address region |
| addressCountry | String | Address country |
| addressPostalCode | String | Address postal code |
| latitude | Number | Location latitude |
| longitude | Number | Location longitude |
| imageCaptions | Array | Array of strings |
| customMetadata | Object | Values must be strings |

___

#### Content Schema

Allowed string values for Branch Universal Object contentSchema property.

| Value |
| ----- |
| 'COMMERCE_AUCTION' |
| 'COMMERCE_BUSINESS' |
| 'COMMERCE_OTHER' |
| 'COMMERCE_PRODUCT' |
| 'COMMERCE_RESTAURANT' |
| 'COMMERCE_SERVICE' |
| 'COMMERCE_TRAVEL_FLIGHT' |
| 'COMMERCE_TRAVEL_HOTEL' |
| 'COMMERCE_TRAVEL_OTHER' |
| 'GAME_STATE' |
| 'MEDIA_IMAGE' |
| 'MEDIA_MIXED' |
| 'MEDIA_MUSIC' |
| 'MEDIA_OTHER' |
| 'MEDIA_VIDEO' |
| 'OTHER' |
| 'TEXT_ARTICLE' |
| 'TEXT_BLOG' |
| 'TEXT_OTHER' |
| 'TEXT_RECIPE' |
| 'TEXT_REVIEW' |
| 'TEXT_SEARCH_RESULTS' |
| 'TEXT_STORY' |
| 'TEXT_TECHNICAL_DOC' |

___

#### Condition

Allowed string values for Branch Universal Object condition property.

| Value |
| ----- |
| 'OTHER' |
| 'EXCELLENT' |
| 'NEW' |
| 'GOOD' |
| 'FAIR' |
| 'POOR' |
| 'USED' |
| 'REFURBISHED' |

___

#### Product Category

Allowed string values for Branch Universal Object productCategory property.

| Value |
| ----- |
| 'Animals & Pet Supplies' |
| 'Apparel & Accessories' |
| 'Arts & Entertainment' |
| 'Baby & Toddler' |
| 'Business & Industrial' |
| 'Cameras & Optics' |
| 'Electronics' |
| 'Food, Beverages & Tobacco' |
| 'Furniture' |
| 'Hardware' |
| 'Health & Beauty' |
| 'Home & Garden' |
| 'Luggage & Bags' |
| 'Mature' |
| 'Media' |
| 'Office Supplies' |
| 'Religious & Ceremonial' |
| 'Software' |
| 'Sporting Goods' |
| 'Toys & Games' |
| 'Vehicles & Parts' |

___

#### Link Properties Parameters

|    KEY   |   TYPE   |          MEANING
| -------- | -------- |------------------------
| alias    | `string` | Specify a link alias in place of the standard encoded short URL (e.g., `[branchsubdomain]/youralias or yourdomain.co/youralias)`. Link aliases are unique, immutable objects that cannot be deleted. **Aliases on the legacy `bnc.lt` domain are incompatible with Universal Links and Spotlight**
| campaign | `string` | Use this field to organize the links by actual campaign. For example, if you launched a new feature or product and want to run a campaign around that
| channel  | `string` | Use channel to tag the route that your link reaches users. For example, tag links with ‘Facebook’ or ‘LinkedIn’ to help track clicks and installs through those paths separately
| feature  | `string` | This is the feature of your app that the link might be associated with. eg: if you had built a referral program, you would label links with the feature `referral`
| stage    | `string` | Use this to categorize the progress or category of a user when the link was generated. For example, if you had an invite system accessible on level 1, level 3 and 5, you could differentiate links generated at each level with this parameter
| tags     | `array`  | This is a free form entry with unlimited values. Use it to organize your link data with labels that don’t fit within the bounds of the above

___

### Control parameters

Specify control parameters in calls to `generateShortUrl` and `showShareSheet`.

All Branch control parameters are supported. See [here](https://dev.branch.io/getting-started/configuring-links/guide/#link-control-parameters) for a complete list. In particular, these control parameters determine where the link redirects.

|        KEY         |   TYPE   |       MEANING
| ------------------ | -------- | --------------------
| $fallback_url      | `string` | Change the redirect endpoint for all platforms - so you don’t have to enable it by platform
| $desktop_url       | `string` | Change the redirect endpoint on desktops  
| $android_url       | `string` | Change the redirect endpoint for Android
| $ios_url           | `string` | Change the redirect endpoint for iOS
| $ipad_url          | `string` | Change the redirect endpoint for iPads
| $fire_url          | `string` | Change the redirect endpoint for Amazon Fire OS
| $blackberry_url    | `string` | Change the redirect endpoint for Blackberry OS
| $windows_phone_url | `string` | Change the redirect endpoint for Windows OS

___

#### Params object

The params object is returned by various linking methods including subscribe, getLatestReferringParams, and getFirstReferringParams. Params will contain any data associated with the Branch link that was clicked before the app session began.  

Branch returns explicit parameters every time. Here is a list, and a description of what each represents.  
* `~` denotes analytics  
* `+` denotes information added by Branch

| **Parameter** | **Meaning**
| --- | ---
| ~channel | The channel on which the link was shared, specified at link creation time
| ~feature | The feature, such as `invite` or `share`, specified at link creation time
| ~tags | Any tags, specified at link creation time
| ~campaign | The campaign the link is associated with, specified at link creation time
| ~stage | The stage, specified at link creation time
| ~creation_source | Where the link was created ('API', 'Dashboard', 'SDK', 'iOS SDK', 'Android SDK', or 'Web SDK')
| ~referring_link | The referring link that drove the install/open, if present
| ~id | Automatically generated 18 digit ID number for the link that drove the install/open, if present
| +match_guaranteed | True or false as to whether the match was made with 100% accuracy
| +referrer | The referrer for the link click, if a link was clicked
| +phone_number | The phone number of the user, if the user texted himself/herself the app
| +is_first_session | Denotes whether this is the first session (install) or any other session (open)
| +clicked_branch_link | Denotes whether or not the user clicked a Branch link that triggered this session
| +click_timestamp | Epoch timestamp of when the click occurred
| +url | The full URL of the link that drove the install/open, if present (e.g. bnc.lt/m/abcde12345)

See also [Deep Link Routing](https://dev.branch.io/getting-started/deep-link-routing/guide/react/#branch-provided-data-parameters-in-callback)
on the Branch documentation site for more information.

Any additional data attached to the Branch link will be available unprefixed.

___

## Troubleshooting

### Example apps for testing

See the [examples](./examples) folder for a number of example apps that demonstrate usage of the
SDK and can be used for testing. There is also a [tutorial app](./examples/webview_tutorial) that
walks you through integrating the Branch SDK step by step.

### Simulate an install

**Do not test in production.**

This requires a native method call that must be made before JS has loaded. There are two options.

1. Use a `branch.json` file with your project. See https://rnbranch.app.link/branch-json for full details.
    Add `"debugMode": true` to `branch.debug.json`:

    ```json
    {
      "appleSearchAdsDebugMode": true,
      "debugMode": true,
      "delayInitToCheckForSearchAds": true
    }
    ```

    Do not add this setting to `branch.json`, or it will be enabled for release builds.

2. Modify your native app code.

    **Android**

    Simulated installs may be enabled on Android by adding `<meta-data android:name="io.branch.sdk.TestMode" android:value="true"/>` to the `application` element of your Android manifest. Use this in a build type
    such as `debug` or a product flavor, or be sure to remove it from your manifest before releasing to prod.
    See https://docs.branch.io/pages/apps/android/#simulate-an-install for full details.

    Alternately, add `RNBranchModule.setDebug();` in your MainActivity before the call to `initSession`. Be sure to remove it
    before releasing to prod.

    ```java
    // Remove before prod release
    RNBranchModule.setDebug();
    RNBranchModule.initSession(getIntent().getData(), this);
    ```

    **iOS**

    Add `[RNBranch setDebug];` or `RNBranch.setDebug()` in your AppDelegate before the call to `initSession`.
    Use conditional compilation or remove before releasing to prod.

    _Swift_
    ```Swift
    #if DEBUG
        RNBranch.setDebug()
    #endif
    RNBranch.initSession(launchOptions: launchOptions, isReferrable: true)
    ```

    _Objective-C_
    ```Objective-C
    #ifdef DEBUG
        [RNBranch setDebug];
    #endif
    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
    ```

### Using getLatestReferringParams to handle link opens

The `getLatestReferringParams` method is essentially a synchronous method that retrieves the latest
referring link parameters stored by the native SDK. However, React Native does not support synchronous
calls to native code from JavaScript, so the method returns a promise. You must `await` the response
or use `then` to receive the result. The same remarks apply to the `getFirstReferringParams` method.
However, this is only a restriction of React Native. The purpose of `getLatestReferringParams` is to
retrieve those parameters one time. The promise will only return one result. It will not continue
to return results when links are opened or wait for a link to be opened. This method is not intended
to notify the app when a link has been opened.

To receive notification whenever a link is opened, _including at app launch_, call
`branch.subscribe`. The callback to this method will return any initial link that launched the
app and all subsequent link opens. There is no need to call `getLatestReferringParams` at app
launch to check for an initial link. Use `branch.subscribe` to handle all link opens.

### General troubleshooting

See the troubleshooting guide for each native SDK:

- [iOS](https://docs.branch.io/pages/apps/ios/#troubleshoot-issues)
- [Android](https://docs.branch.io/pages/apps/android/#troubleshoot-issues)
