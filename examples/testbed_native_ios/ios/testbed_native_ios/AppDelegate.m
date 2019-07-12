//
//  AppDelegate.m
//  testbed_native_ios
//
//  Created by Jimmy Dee on 3/22/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <React/RCTLog.h>
#import <react-native-branch/RNBranch.h>

#import <Branch/Branch.h>

#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(nullable NSDictionary *)launchOptions
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(linkOpened:) name:RNBranchLinkOpenedNotification object:nil];

#ifdef USE_BRANCH_TEST_INSTANCE
    [RNBranch useTestInstance];
#endif // USE_BRANCH_TEST_INSTANCE
    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    if (![RNBranch.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]) {
        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    return [RNBranch continueUserActivity:userActivity];
}

- (void)linkOpened:(NSNotification *)notification
{
    NSError *error = notification.userInfo[RNBranchLinkOpenedNotificationErrorKey];
    NSDictionary *params = notification.userInfo[RNBranchLinkOpenedNotificationParamsKey];
    NSURL *uri = notification.userInfo[RNBranchLinkOpenedNotificationUriKey];
    BranchUniversalObject *branchUniversalObject = notification.userInfo[RNBranchLinkOpenedNotificationBranchUniversalObjectKey];
    BranchLinkProperties *linkProperties = notification.userInfo[RNBranchLinkOpenedNotificationLinkPropertiesKey];

    RCTLog(@"Received %@", notification.name);

    if (error) {
        RCTLogError(@"Error opening Branch link: %@", error.localizedDescription);
        return;
    }

    RCTLog(@"uri: %@, params: %@", uri, params);
    RCTLog(@"BranchUniversalObject = %@", branchUniversalObject);
    RCTLog(@"BranchLinkProperties = %@", linkProperties);

    // Now route to the appropriate view
}

@end
