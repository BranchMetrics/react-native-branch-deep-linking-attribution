#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

extern NSString * _Nonnull const RNBranchLinkOpenedNotification;
extern NSString * _Nonnull const RNBranchLinkOpenedNotificationErrorKey;
extern NSString * _Nonnull const RNBranchLinkOpenedNotificationParamsKey;
extern NSString * _Nonnull const RNBranchLinkOpenedNotificationUriKey;
extern NSString * _Nonnull const RNBranchLinkOpenedNotificationBranchUniversalObjectKey;
extern NSString * _Nonnull const RNBranchLinkOpenedNotificationLinkPropertiesKey;

@interface RNBranch : NSObject <RCTBridgeModule>

+ (void)initSessionWithLaunchOptions:(NSDictionary * _Nullable)launchOptions isReferrable:(BOOL)isReferrable;
+ (BOOL)handleDeepLink:(NSURL * _Nonnull)url;
+ (BOOL)continueUserActivity:(NSUserActivity * _Nonnull)userActivity;

// Must be called before any other static method below
+ (void)useTestInstance;

+ (void)setDebug;
+ (void)delayInitToCheckForSearchAds;
+ (void)setAppleSearchAdsDebugMode;
+ (void)setRequestMetadataKey:(NSString * _Nonnull)key value:(NSObject * _Nonnull)value;

@end
