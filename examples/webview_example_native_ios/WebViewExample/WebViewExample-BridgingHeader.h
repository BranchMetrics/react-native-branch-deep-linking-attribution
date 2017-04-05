//
//  WebViewExample-BridgingHeader.h
//  WebViewExample
//
//  Created by Jimmy Dee on 4/5/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

/*
 * The React pod cannot be built with use_frameworks!. It fails to find a yoga header. To
 * import modules into Swift from static libraries, all pods are imported into a
 * bridging header.
 */

#import <Branch/Branch.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <react-native-branch/RNBranch.h>

#import "RCTSwiftLog.h"
