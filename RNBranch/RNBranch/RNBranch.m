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

@implementation RNBranch

NSString * const initSessionWithLaunchOptionsFinishedEventName = @"initSessionWithLaunchOptionsFinished";
static NSDictionary* initSessionWithLaunchOptionsResult;

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

//Called by AppDelegate.m -- stores initSession result in static variables and raises initSessionFinished event that's captured by the RNBranch instance to emit it to React Native
+ (void)initSessionWithLaunchOptionsFinished:(NSDictionary*)params withError:(NSError*)error {
  initSessionWithLaunchOptionsResult = @{@"params": params ? params : [NSNull null], @"error": error ? error : [NSNull null]};
  [[NSNotificationCenter defaultCenter] postNotificationName:initSessionWithLaunchOptionsFinishedEventName object:initSessionWithLaunchOptionsResult]; //Forward to RNBranch instance
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
  [self.bridge.eventDispatcher sendAppEventWithName:@"RNBranch.initSessionFinished" body:[notification object]];
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

@end
