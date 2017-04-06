//
//  RNBranchEventEmitter.m
//  Pods
//
//  Created by Jimmy Dee on 4/6/17.
//
//

#import "RNBranchEventEmitter.h"

// Notification/Event Names
NSString *const kInitSessionSuccess = @"RNBranchEventEmitter/initSessionSuccess";
NSString *const kInitSessionError = @"RNBranchEventEmitter/initSessionError";

@implementation RNBranchEventEmitter

RCT_EXPORT_MODULE();

- (NSDictionary<NSString *, NSString *> *)constantsToExport {
    return @{ @"INIT_SESSION_SUCCESS": kInitSessionSuccess,
              @"INIT_SESSION_ERROR": kInitSessionError,
              };
}

- (NSArray<NSString *> *)supportedEvents {
    return @[kInitSessionSuccess,
             kInitSessionError
             ];
}

- (void)startObserving {
    for (NSString *event in [self supportedEvents]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleNotification:)
                                                     name:event
                                                   object:nil];
    }
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

# pragma mark - Public

+ (void)initSessionDidSucceedWithPayload:(NSDictionary *)payload
{
    [self postNotificationName:kInitSessionSuccess withPayload:payload];
}

+ (void)initSessionDidEncounterErrorWithPayload:(NSDictionary *)payload
{
    [self postNotificationName:kInitSessionError withPayload:payload];
}

# pragma mark - Private

+ (void)postNotificationName:(NSString *)name withPayload:(NSObject *)object {
    NSDictionary<NSString *, id> *payload = @{@"payload": object};
    
    [[NSNotificationCenter defaultCenter] postNotificationName:name
                                                        object:self
                                                      userInfo:payload];
}

- (void)handleNotification:(NSNotification *)notification {
    [self sendEventWithName:notification.name body:notification.userInfo];
}

@end
