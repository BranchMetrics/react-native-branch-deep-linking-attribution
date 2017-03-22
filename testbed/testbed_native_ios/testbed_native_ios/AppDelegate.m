//
//  AppDelegate.m
//  testbed_native_ios
//
//  Created by Jimmy Dee on 3/22/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <react-native-branch/RNBranch.h>

#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(nullable NSDictionary *)launchOptions
{
    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(linkOpened:) name:RNBranchLinkOpenedNotification object:nil];
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    if (![RNBranch handleDeepLink:url]) {
        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
    return [RNBranch continueUserActivity:userActivity];
}

- (void)linkOpened:(NSNotification *)notification
{
    NSString *error = notification.userInfo[RNBranchLinkOpenedNotificationErrorKey];
    NSString *params = notification.userInfo[RNBranchLinkOpenedNotificationParamsKey];
    NSString *uri = notification.userInfo[RNBranchLinkOpenedNotificationUriKey];

    NSLog(@"Received %@", notification.name);

    if (error) {
        NSLog(@"Error opening Branch link: %@", error);
        return;
    }

    NSLog(@"uri: %@, params: %@", uri, params);

    // Now route to the appropriate view
}

@end
