# Updating to 1.0.0

Version 1.0.0 of react-native-branch requires version 0.40.0 or later
of react-native. You will need to make some changes to the native iOS
project in order to build:

Change `#import "RNBranch.h"` to `#import <react-native-branch/RNBranch.h>`
in AppDelegate.m. The native React library also requires similar changes for
headers, for example:

```Objective-C
#import <React/RCTRootView.h>
#import <react-native-branch/RNBranch.h>
```
