## Setting Up Branch
After [installing](./installation.md) Branch, you will need to set up your android and ios apps to handle incoming links:

**Note:** When using `react-native` < 0.40 and `react-native-branch` 0.9, specify imports without a path prefix, e.g. `#import "RNBranch.h"` instead of `#import <react-native-branch/RNBranch.h>`.

#### iOS project
1. Modify AppDelegate.m as follows:
    ```objective-c
    #import <react-native-branch/RNBranch.h> // at the top

    // Initialize the Branch Session at the top of existing didFinishLaunchingWithOptions
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
      // Uncomment this line to use the test key instead of the live one.
      // [RNBranch useTestInstance]
      [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this

      NSURL *jsCodeLocation;
      //...
    }

    // Add the openURL and continueUserActivity functions
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
1. [Add a String entry branch_key](https://dev.branch.io/references/ios_sdk/#add-your-branch-key-to-your-project) with your Branch key to your info.plist

2. [Register a URI Scheme for Direct Deep Linking](https://dev.branch.io/references/ios_sdk/#register-a-uri-scheme-direct-deep-linking-optional-but-recommended) (optional but recommended)

3. [Configure for Universal Linking](https://dev.branch.io/references/ios_sdk/#support-universal-linking-ios-9)

#### android project

1. Add RNBranchPackage to packages list in MainApplication.java (`android/app/src/[...]/MainApplication.java`)
    ```java
    // ...

    // import Branch and RNBranch
    import io.branch.rnbranch.*;
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

1. Override onStart and onNewIntent in MainActivity.java to handle Branch links (`android/app/src/[...]/MainActivity.java`)
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
            RNBranchModule.initSession(this.getIntent().getData(), this);
        }

        @Override
        public void onNewIntent(Intent intent) {
            this.setIntent(intent);
        }
        // ...
    }
    ```

2. [Configure AndroidManifest.xml](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#configure-manifest). Be sure to set `android:launchMode="singleTask"` on your main activity.

3. [Register for Google Play Install Referrer](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-for-google-play-install-referrer). The "receiver" element needs to be added to the "application" node in AndroidManifest.xml

4. [Register a URI scheme](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#register-a-uri-scheme)
- The "intent-filter" element needs to be added to the activity node, whose android:name is "com.yourAppName.MainActivity". This node is in the "application" node.
- If you already have an intent-filter tag, this has to be added as an additional one.
- Make sure to replace "yourApp" with the scheme you specified in the Branch dashboard.

5. [Enable Auto Session Management](https://dev.branch.io/getting-started/sdk-integration-guide/guide/android/#enable-auto-session-management). Simply add the "android:name" attribute to your "application" node in your AndroidManifest.xml

6. [Enable App Links for Android M and above](https://dev.branch.io/getting-started/universal-app-links/guide/android/) (optional but recommended)

7. Add your Branch key to AndroidManifest: Inside of application node add     `<meta-data android:name="io.branch.sdk.BranchKey" android:value="your_branch_key" />`
