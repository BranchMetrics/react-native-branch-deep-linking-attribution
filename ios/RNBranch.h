#import <Foundation/Foundation.h>
#import "RCTEventEmitter.h"

@interface RNBranch : RCTEventEmitter

+ (void)initSessionWithLaunchOptions:(NSDictionary *)launchOptions isReferrable:(BOOL)isReferrable;
+ (BOOL)handleDeepLink:(NSURL *)url;
+ (BOOL)continueUserActivity:(NSUserActivity *)userActivity;

@end
