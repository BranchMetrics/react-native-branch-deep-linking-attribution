The `setDebug` method exists in the underlying native SDKs and the documentation
for the react-native-branch SDK. Unfortunately, it is not possible to
implement it in JavaScript immediately because the native methods must be called
before initializing the native SDKs. Currently, the native SDKs are initialized
before the JavaScript loads. By the time a React Native app calls `setDebug`,
it is too late to call it. This is likely to change in a future release.

For now, it is necessary to make the call directly in native code on both
platforms.

As of 2.0.0-beta.7, it is also possible to call `setDebug` using the `debugMode`
parameter in the `branch.json` configuration file. See
https://rnbranch.app.link/branch-json for details.

#### iOS

##### Objective-C

In AppDelegate.m, before calling `[RNBranch initSessionWithLaunchOptions:isReferrable:]`,
call `[RNBranch setDebug]`.

```Obj-C
[RNBranch setDebug];
[RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
```

##### Swift

In AppDelegate.swift, before calling `RNBranch.initSession(launchOptions:, isReferrable:)`,
call `RNBranch.setDebug()`.

```Swift
RNBranch.setDebug()
RNBranch.initSession(launchOptions: launchOptions, isReferrable: true)
```

#### Android

In your Activity source file, e.g. MainActivity.java, before calling `RNBranch.initSession()`,
call `RNBranch.setDebug()`:

```Java
RNBranchModule.setDebug();
RNBranchModule.initSession(getIntent().getData(), this);
```
