//
//  RNBranch.h
//  RNBranch
//
//  Created by Kevin Stumpf on 1/28/16.
//

#import <Foundation/Foundation.h>
#import "RCTEventEmitter.h"

@interface RNBranch : RCTEventEmitter

+ (void)initSessionWithLaunchOptions:(NSDictionary *)launchOptions isReferrable:(BOOL)isReferrable;
+ (BOOL)handleDeepLink:(NSURL *)url;
+ (BOOL)continueUserActivity:(NSUserActivity *)userActivity;

@end
