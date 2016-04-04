//
//  RNBranch.m
//  RNBranch
//
//  Created by Kevin Stumpf on 1/28/16.
//

#import "RNBranch.h"
#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <Branch/Branch.h>
#import "BranchLinkProperties.h"
#import "BranchUniversalObject.h"


@implementation RNBranch

NSString * const initSessionWithLaunchOptionsFinishedEventName = @"initSessionWithLaunchOptionsFinished";
static NSDictionary* initSessionWithLaunchOptionsResult;

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

//Called by AppDelegate.m -- stores initSession result in static variables and raises initSessionFinished event that's captured by the RNBranch instance to emit it to React Native
+ (void)initSessionWithLaunchOptions:(NSDictionary *)launchOptions isReferrable:(BOOL)isReferrable {
    [[Branch getInstance] initSessionWithLaunchOptions:launchOptions isReferrable:isReferrable andRegisterDeepLinkHandler:^(NSDictionary *params, NSError *error) {
        initSessionWithLaunchOptionsResult = @{@"params": params ? params : [NSNull null], @"error": error ? [error localizedDescription] : [NSNull null]};
        [[NSNotificationCenter defaultCenter] postNotificationName:initSessionWithLaunchOptionsFinishedEventName object:initSessionWithLaunchOptionsResult]; //Forward to RNBranch instance
    }];
}

+ (BOOL)handleDeepLink:(NSURL *)url {
    return [[Branch getInstance] handleDeepLink:url];
}

+ (BOOL)continueUserActivity:(NSUserActivity *)userActivity {
    return [[Branch getInstance] continueUserActivity:userActivity];
}

- (id)init {
  self = [super init];

  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onInitSessionFinished:) name:initSessionWithLaunchOptionsFinishedEventName object:nil];

  return self;
}

- (void) dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void) onInitSessionFinished:(NSNotification*) notification {
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"RNBranch.initSessionFinished" body:[notification object]];
}


RCT_EXPORT_METHOD(getInitSessionResult:(RCTResponseSenderBlock)callback) {
  callback(@[initSessionWithLaunchOptionsResult ? initSessionWithLaunchOptionsResult : [NSNull null]]);
}

RCT_EXPORT_METHOD(setDebug) {
  Branch *branch = [Branch getInstance];
  [branch setDebug];
}

RCT_EXPORT_METHOD(getLatestReferringParams:(RCTResponseSenderBlock)callback)
{
  Branch *branch = [Branch getInstance];
  callback(@[[branch getLatestReferringParams]]);
}

RCT_EXPORT_METHOD(getFirstReferringParams:(RCTResponseSenderBlock)callback)
{
  Branch *branch = [Branch getInstance];
  callback(@[[branch getFirstReferringParams]]);
}

RCT_EXPORT_METHOD(setIdentity:(NSString *)identity)
{
  Branch *branch = [Branch getInstance];
  [branch setIdentity:identity];
}

RCT_EXPORT_METHOD(logout)
{
  Branch *branch = [Branch getInstance];
  [branch logout];
}

RCT_EXPORT_METHOD(userCompletedAction:(NSString *)event withState:(NSDictionary *)appState)
{
  Branch *branch = [Branch getInstance];
  [branch userCompletedAction:event withState:appState];
}

RCT_EXPORT_METHOD(showShareSheet:(NSDictionary *)shareOptionsMap withBranchUniversalObject:(NSDictionary *)branchUniversalObjectMap withLinkProperties:(NSDictionary *)linkPropertiesMap withCallback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^(void){
    BranchUniversalObject *branchUniversalObject = [[BranchUniversalObject alloc] initWithCanonicalIdentifier:[branchUniversalObjectMap objectForKey:@"canonicalIdentifier"]];
    branchUniversalObject.title = [branchUniversalObjectMap objectForKey:@"contentTitle"];
    branchUniversalObject.contentDescription = [branchUniversalObjectMap objectForKey:@"contentDescription"];
    branchUniversalObject.imageUrl = [branchUniversalObjectMap objectForKey:@"contentImageUrl"];

    NSDictionary* metaData = [branchUniversalObjectMap objectForKey:@"metadata"];
    if(metaData) {
      NSEnumerator *enumerator = [metaData keyEnumerator];
      id metaDataKey;
      while((metaDataKey = [enumerator nextObject])) {
        [branchUniversalObject addMetadataKey:metaDataKey value:[metaData objectForKey:metaDataKey]];
      }
    }

    BranchLinkProperties *linkProperties = [[BranchLinkProperties alloc] init];
    linkProperties.channel = [linkPropertiesMap objectForKey:@"channel"];
    linkProperties.feature = [linkPropertiesMap objectForKey:@"feature"];

    [branchUniversalObject showShareSheetWithLinkProperties:linkProperties
                                             andShareText:[shareOptionsMap objectForKey:@"messageBody"]
                                             fromViewController:nil
                                              completion:^(NSString *activityType, BOOL completed){
      NSDictionary *result = @{
        @"channel" : activityType ? activityType : [NSNull null],
        @"completed" : [NSNumber numberWithBool:completed],
        @"error" : [NSNull null]
      };

      callback(@[result]);
    }];
  });
}


RCT_EXPORT_METHOD(getShortUrl:(NSDictionary *)linkPropertiesMap resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *feature = [linkPropertiesMap objectForKey:@"feature"];
    NSString *channel = [linkPropertiesMap objectForKey:@"channel"];
    NSString *stage = [linkPropertiesMap objectForKey:@"stage"];
    NSArray *tags = [linkPropertiesMap objectForKey:@"tags"];

    [[Branch getInstance] getShortURLWithParams:linkPropertiesMap
                                        andTags:tags
                                     andChannel:channel
                                     andFeature:feature
                                       andStage:stage
                                    andCallback:^(NSString *url, NSError *error) {
                                        if (error) {
                                            NSLog(@"RNBranch::Error: %@", error.localizedDescription);
                                            reject(@"RNBranch::Error", @"getShortURLWithParams", error);
                                        }
                                        resolve(url);
                                    }];
}

@end
