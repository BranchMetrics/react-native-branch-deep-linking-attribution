# webview_tutorial

## Prerequisites

Make sure your app is set up in the [Branch Dashboard](https://dashboard.branch.io).
From the Dashboard, you need:

  - Your Branch live and test keys
  - The domains used with these keys
  - The bundle identifier associated with your app in the Dashboard (iOS only)

## Installation

1. Add the react-native-branch SDK.

    ```bash
    yarn add react-native-branch
    ```

    or

    ```bash
    npm install --save react-native-branch
    ```

    This installs the latest release from NPM. To use the SDK from this local repo instead of NPM:

    ```bash
    yarn add file:../..
    ```

    or

    ```bash
    npm install --save ../..
    ```

2. Run `react-native link`:

    ```bash
    react-native link react-native-branch
    ```

## iOS/Xcode setup

1. Open the `ios/webview_tutorial.xcodeproj` using Xcode. Select the AppDelegate.m file from the
    left panel. Alternately, open `ios/webview_tutorial/AppDelegate.m` in your favorite editor.
    At the top of the file, add:

    ```Objective-C
    #import <react-native-branch/RNBranch.h>
    ```

2. Find the `application:didFinishLaunchingWithOptions:` method near the top of the AppDelegate.m
    file. Add the following to the beginning of that method:

    ```Objective-C
    #ifdef DEBUG
        [RNBranch useTestInstance];
    #endif // DEBUG

    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
    ```

3. Add the following method before the final `@end` in the AppDelegate.m file:

    ```Objective-C
    - (BOOL)application:(UIApplication *)app continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler
    {
        return [RNBranch.branch continueUserActivity:userActivity];
    }
    ```

4. In Xcode, change the bundle identifier to the correct bundle identifier for your Branch app. Also
    change the code signing settings to use your signing team.

5. In Xcode, add your Branch keys to the Info.plist as a dictionary.

6. In Xcode, add your Branch domains to the application's associated domains.

## Android setup

1. Open the `android` project in Android Studio. Open the `MainApplication.java` file in Android Studio.
    Alternately, open `android/app/src/main/java/com/webview_tutorial/MainApplication.java` in your
    favorite text editor. At the top of the file, after the `package` declaration, add the following line:

    ```Java
    import io.branch.referral.Branch;
    ```

2. In the `onCreate` method, add the following line:

    ```Java
    Branch.getAutoInstance(this);
    ```

3. Open the `android/app/src/main/java/com/webview_tutorial/MainActivity.java` file in Android Studio
    or your favorite editor. Add the following imports near the top of the file:

    ```Java
    import io.branch.rnbranch.RNBranchModule;
    import android.content.Intent;
    ```

4. Add the `onStart` method in the MainActivity:

    ```Java
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }
    ```

5. Add the `onNewIntent` method in the MainActivity:

    ```Java
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent();
        setIntent(intent);
    }
    ```

6. Open the `android/app/src/main/AndroidManifest.xml` in Android Studio or a text editor. Add
    `android:launchMode="singleTask"` to the MainActivity:

    ```xml
    <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
        android:windowSoftInputMode="adjustResize"
        android:launchMode="singleTask">
    ```

7. Add `intent-filters` to the MainActivity in the Android manifest using your Branch domains:

    ```xml
    <!-- Branch intent-filter -->
    <intent-filter android:autoVerify='true'>
        <action android:name='android.intent.action.VIEW'/>
        <category android:name='android.intent.category.DEFAULT'/>
        <category android:name='android.intent.category.BROWSABLE'/>
        <data android:scheme='https' android:host='yourapp.app.link'/>
        <data android:scheme='https' android:host='yourapp-alternate.app.link'/>
        <data android:scheme='https' android:host='yourapp.test-app.link'/>
        <data android:scheme='https' android:host='yourapp-alternate.test-app.link'/>
    </intent-filter>
    ```

    Replace `yourapp` in the example above with your `app.link` subdomain from the
    Branch portal.

8. Add your Branch keys to the Android manifest at the end of the application element.

    ```xml
    <!-- Branch keys -->
    <meta-data android:name='io.branch.sdk.BranchKey' android:value='key_live_xxxx'/>
    <meta-data android:name='io.branch.sdk.BranchKey.test' android:value='key_test_yyyy'/>
    ```

    Replace `key_live_xxxx` and `key_test_yyyy` with your Branch live and test keys from the
    Branch Dashboard.

9. Add a file called `android/app/src/debug/AndroidManifest.xml` with the following contents:

    ```xml
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        package="com.webview_tutorial">

        <application>
            <meta-data android:name="io.branch.sdk.TestMode" android:value="true" /> <!-- Set to true to use Branch_Test_Key -->
        </application>

    </manifest>
    ```

## React Native setup

1. Open the file `src/App.js`. Add the following line to import the react-native-branch SDK:

    ```js
    import branch from 'react-native-branch'
    ```

2. Add a property to the App class called `_unsubscribeFromBranch`. Initialize it to null:

    ```js
    _unsubscribeFromBranch = null
    ```

3. Add a `componentDidMount` method to the App class:

    ```js
    componentDidMount() {
      this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
        if (error) {
          console.error("Error from Branch: " + error)
          return
        }

        console.log("Branch params: " + JSON.stringify(params))

        if (!params['+clicked_branch_link']) return

        // Get title and url for route
        let title = params.$og_title
        let url = params.$canonical_url
        let image = params.$og_image_url

        // Now push the view for this URL
        this.navigator.push({ title: title, url: url, image: image })
      })
    }
    ```

4. Add a `componentWillUnmount` method to the App class:

    ```js
    componentWillUnmount() {
      if (this._unsubscribeFromBranch) {
        this._unsubscribeFromBranch()
        this._unsubscribeFromBranch = null
      }
    }
    ```

5. Open the `src/Article.js` class. Import the `branch` instance and the `RegisterViewEvent`
    constant.

    ```js
    import branch, { RegisterViewEvent } from 'react-native-branch'
    ```

6. Add a `buo` property to the Article class and initialize it to null;

    ```js
    buo = null
    ```

7. Create a Branch Universal Object in the `componentDidMount` class and register a view
    event. Add the following method to the Article class:

    ```js
    async componentDidMount() {
      this.buo = await branch.createBranchUniversalObject("planet/" + this.props.route.title, {
        automaticallyListOnSpotlight: true, // ignored on Android
        canonicalUrl: this.props.route.url,
        title: this.props.route.title,
        contentImageUrl: this.props.route.image,
        contentIndexingMode: 'public' // for Spotlight indexing
      })
      this.buo.userCompletedAction(RegisterViewEvent)
      console.log("Created Branch Universal Object and logged RegisterViewEvent.")
    }
    ```

8. Add a `componentWillUnmount` method with a call to `this.buo.release()`.
    ```js
    componentWillUnmount() {
      if (!this.buo) return
      this.buo.release()
      this.buo = null
    }
    ```

9. Implement the `onShare` method to show the Branch share sheet. Add the following as the
    body of the onShare method:

    ```js
    let { channel, completed, error } = await this.buo.showShareSheet({
      emailSubject: "The Planet " + this.props.route.title,
      messageBody: "Read about the planet " + this.props.route.title + ".",
      messageHeader: "The Planet " + this.props.route.title
    }, {
      feature: "share",
      channel: "RNApp"
    }, {
      $desktop_url: this.props.route.url,
      $ios_deepview: "branch_default"
    })

    if (error) {
      console.error("Error sharing via Branch: " + error)
      return
    }

    console.log("Share to " + channel + " completed: " + completed)
    ```
