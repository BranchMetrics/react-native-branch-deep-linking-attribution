#import "RNBranch.h"
#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <Branch/Branch.h>

#pragma mark - RNBranchProperty

/*
 * Utility class to represent dynamically all supported JS link properties.
 */
@interface RNBranchProperty : NSObject
@property (nonatomic) SEL setterSelector;
@property (nonatomic) Class type;

+ (NSDictionary<NSString *, RNBranchProperty *> *)linkProperties;
+ (NSDictionary<NSString *, RNBranchProperty *> *)universalObjectProperties;
+ (instancetype) propertyWithSetterSelector:(SEL)selector type:(Class)type;

- (instancetype) initWithSetterSelector:(SEL)selector type:(Class)type NS_DESIGNATED_INITIALIZER;
@end

@implementation RNBranchProperty

+ (NSDictionary<NSString *, RNBranchProperty *> *)linkProperties
{
    static NSDictionary<NSString *, RNBranchProperty *> *_linkProperties;
    if (_linkProperties) return _linkProperties;

    _linkProperties =
    @{
      @"alias": [self propertyWithSetterSelector:@selector(setAlias:) type:NSString.class],
      @"campaign": [self propertyWithSetterSelector:@selector(setCampaign:) type:NSString.class],
      @"channel": [self propertyWithSetterSelector:@selector(setChannel:) type:NSString.class],
      // @"duration": [self propertyWithSetterSelector:@selector(setMatchDuration:) type:NSNumber.class], // deprecated
      @"feature": [self propertyWithSetterSelector:@selector(setFeature:) type:NSString.class],
      @"stage": [self propertyWithSetterSelector:@selector(setStage:) type:NSString.class],
      @"tags": [self propertyWithSetterSelector:@selector(setTags:) type:NSArray.class]
      };

    return _linkProperties;
}

+ (NSDictionary<NSString *,RNBranchProperty *> *)universalObjectProperties
{
    static NSDictionary<NSString *, RNBranchProperty *> *_universalObjectProperties;
    if (!_universalObjectProperties) return _universalObjectProperties;

    _universalObjectProperties =
    @{
      @"canonicalUrl": [self propertyWithSetterSelector:@selector(setCanonicalUrl:) type:NSString.class],
      @"contentDescription": [self propertyWithSetterSelector:@selector(setContentDescription:) type:NSString.class],
      @"contentImageUrl": [self propertyWithSetterSelector:@selector(setImageUrl:) type:NSString.class],
      @"title": [self propertyWithSetterSelector:@selector(setTitle:) type:NSString.class]
     };

    return _universalObjectProperties;
}

+ (instancetype)propertyWithSetterSelector:(SEL)selector type:(Class)type
{
    return [[self alloc] initWithSetterSelector:selector type:type];
}

- (instancetype)initWithSetterSelector:(SEL)selector type:(Class)type
{
    self = [super init];
    if (self) {
        _setterSelector = selector;
        _type = type;
    }
    return self;
}

@end

#pragma mark - Private RNBranch declarations

@interface RNBranch()
@property (nonatomic, readonly) UIViewController *currentViewController;
@end

#pragma mark - RNBranch implementation

@implementation RNBranch

NSString * const initSessionWithLaunchOptionsFinishedEventName = @"initSessionWithLaunchOptionsFinished";
static NSDictionary* initSessionWithLaunchOptionsResult;
static NSString* sourceUrl;
static Branch *branchInstance;

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

#pragma mark - Class methods

+ (void)useTestInstance {
    branchInstance = [Branch getTestInstance];
}

//Called by AppDelegate.m -- stores initSession result in static variables and raises initSessionFinished event that's captured by the RNBranch instance to emit it to React Native
+ (void)initSessionWithLaunchOptions:(NSDictionary *)launchOptions isReferrable:(BOOL)isReferrable {
    if (!branchInstance) {
        branchInstance = [Branch getInstance];
    }
    [branchInstance setDebug];
    [branchInstance initSessionWithLaunchOptions:launchOptions isReferrable:isReferrable andRegisterDeepLinkHandler:^(NSDictionary *params, NSError *error) {
        NSString *errorMessage = error.localizedDescription;
        
        initSessionWithLaunchOptionsResult = @{
                                               @"params": params && params[@"~id"] ? params : [NSNull null],
                                               @"error": errorMessage ?: [NSNull null],
                                               @"uri": sourceUrl ?: [NSNull null]
                                               };
        
        [[NSNotificationCenter defaultCenter] postNotificationName:initSessionWithLaunchOptionsFinishedEventName object:initSessionWithLaunchOptionsResult];
    }];
}

+ (BOOL)handleDeepLink:(NSURL *)url {
    sourceUrl = url ? url.absoluteString : [NSNull null];
    BOOL handled = [branchInstance handleDeepLink:url];
    return handled;
}

+ (BOOL)continueUserActivity:(NSUserActivity *)userActivity {
    return [branchInstance continueUserActivity:userActivity];
}

#pragma mark - Object lifecycle

- (instancetype)init {
    self = [super init];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onInitSessionFinished:) name:initSessionWithLaunchOptionsFinishedEventName object:nil];
    
    return self;
}

- (void) dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Utility methods

- (UIViewController *)currentViewController
{
    UIViewController *current = [UIApplication sharedApplication].keyWindow.rootViewController;
    while (current.presentedViewController && ![current.presentedViewController isKindOfClass:UIAlertController.class]) {
        current = current.presentedViewController;
    }
    return current;
}

- (void) onInitSessionFinished:(NSNotification*) notification {
    id notificationObject = notification.object;
    
    // If there is an error, fire error event
    if (notificationObject[@"error"] != [NSNull null]) {
        [self.bridge.eventDispatcher sendAppEventWithName:@"RNBranch.initSessionError" body:notificationObject];
    }
    
    // otherwise notify the session is finished
    else {
        [self.bridge.eventDispatcher sendAppEventWithName:@"RNBranch.initSessionSuccess" body:notificationObject];
    }
}

- (BranchUniversalObject*) createBranchUniversalObject:(NSDictionary *)branchUniversalObjectMap
{
    BranchUniversalObject *branchUniversalObject = [[BranchUniversalObject alloc] initWithCanonicalIdentifier:branchUniversalObjectMap[@"canonicalIdentifier"]];
    [self setProperties:RNBranchProperty.universalObjectProperties onObject:branchUniversalObject fromMap:branchUniversalObjectMap];
    
    NSDictionary* metaData = branchUniversalObjectMap[@"metadata"];
    for (NSString *metaDataKey in metaData.allKeys) {
        [branchUniversalObject addMetadataKey:metaDataKey value:metaData[metaDataKey]];
    }
    
    return branchUniversalObject;
}

- (BranchLinkProperties*) createLinkProperties:(NSDictionary *)linkPropertiesMap withControlParams:(NSDictionary *)controlParamsMap
{
    BranchLinkProperties *linkProperties = [[BranchLinkProperties alloc] init];

    /*
     * Support properties of BranchLinkProperties in a more dynamic way that is less dependent on
     * the specific native SDK. This provides support for alias, campaign, channel, feature, stage and tags.
     */
    [self setProperties:RNBranchProperty.linkProperties onObject:linkProperties fromMap:linkPropertiesMap];
    
    linkProperties.controlParams = controlParamsMap;
    return linkProperties;
}

- (void)setProperties:(NSDictionary<NSString *, RNBranchProperty *> *)properties onObject:(NSObject *)object fromMap:(NSDictionary *)map
{
    for (NSString *key in map.allKeys) {
        RNBranchProperty *property = properties[key];
        if (!property) {
            NSLog(@"%@ is not a supported link property.", key);
            continue;
        }
        
        id value = map[key];
        Class type = property.type;
        if (![value isKindOfClass:type]) {
            NSLog(@"%@ requires a value of type %@", key, NSStringFromClass(type));
            continue;
        }
        
        SEL setterSelector = property.setterSelector;
        if (![object respondsToSelector:setterSelector]) {
            NSLog(@"%@ is not supported by the native Branch SDK for object of type %@. Please update to the current release using \"pod update\" or \"carthage update\"", key, NSStringFromClass(object.class));
            continue;
        }
        
        [object performSelector:setterSelector withObject:value];
    }
}

#pragma mark - Methods exported to React Native

RCT_EXPORT_METHOD(
                  redeemInitSessionResult:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ){
    resolve(initSessionWithLaunchOptionsResult ? initSessionWithLaunchOptionsResult : [NSNull null]);
    initSessionWithLaunchOptionsResult = [NSNull null];
    sourceUrl = [NSNull null];
}

RCT_EXPORT_METHOD(
                  setDebug
                  ){
    [branchInstance setDebug];
}

RCT_EXPORT_METHOD(
                  getLatestReferringParams:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ){
    resolve([branchInstance getLatestReferringParams]);
}

RCT_EXPORT_METHOD(
                  getFirstReferringParams:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ){
    resolve([branchInstance getFirstReferringParams]);
}

RCT_EXPORT_METHOD(
                  setIdentity:(NSString *)identity
                  ){
    [branchInstance setIdentity:identity];
}

RCT_EXPORT_METHOD(
                  logout
                  ){
    [branchInstance logout];
}

RCT_EXPORT_METHOD(
                  userCompletedAction:(NSString *)event withState:(NSDictionary *)appState
                  ){
    [branchInstance userCompletedAction:event withState:appState];
}

RCT_EXPORT_METHOD(
                  showShareSheet:(NSDictionary *)branchUniversalObjectMap
                  withShareOptions:(NSDictionary *)shareOptionsMap
                  withLinkProperties:(NSDictionary *)linkPropertiesMap
                  withControlParams:(NSDictionary *)controlParamsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ){
    dispatch_async(dispatch_get_main_queue(), ^(void){
        BranchUniversalObject *branchUniversalObject = [self createBranchUniversalObject:branchUniversalObjectMap];
        
        NSMutableDictionary *mutableControlParams = controlParamsMap.mutableCopy;
        if (shareOptionsMap && shareOptionsMap[@"emailSubject"]) {
            mutableControlParams[@"$email_subject"] = shareOptionsMap[@"emailSubject"];
        }
        
        BranchLinkProperties *linkProperties = [self createLinkProperties:linkPropertiesMap withControlParams:mutableControlParams];
        
        [branchUniversalObject showShareSheetWithLinkProperties:linkProperties
                                                   andShareText:shareOptionsMap[@"messageBody"]
                                             fromViewController:self.currentViewController
                                                     completionWithError:^(NSString * _Nullable activityType, BOOL completed, NSError * _Nullable activityError){
                                                         if (activityError) {
                                                             NSString *errorCodeString = [NSString stringWithFormat:@"%ld", (long)activityError.code];
                                                             reject(errorCodeString, activityError.localizedDescription, activityError);
                                                             return;
                                                         }

                                                         NSDictionary *result = @{
                                                                                  @"channel" : activityType ?: [NSNull null],
                                                                                  @"completed" : @(completed),
                                                                                  @"error" : [NSNull null]
                                                                                  };
                                                         
                                                         resolve(result);
                                                     }];
    });
}

RCT_EXPORT_METHOD(
                  registerView:(NSDictionary *)branchUniversalObjectMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    BranchUniversalObject *branchUniversalObject = [self createBranchUniversalObject:branchUniversalObjectMap];
    [branchUniversalObject registerViewWithCallback:^(NSDictionary *params, NSError *error) {
        if (!error) {
            resolve([NSNull null]);
        } else {
            reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
        }
    }];
}

RCT_EXPORT_METHOD(
                  generateShortUrl:(NSDictionary *)branchUniversalObjectMap
                  withLinkProperties:(NSDictionary *)linkPropertiesMap
                  withControlParams:(NSDictionary *)controlParamsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    BranchUniversalObject *branchUniversalObject = [self createBranchUniversalObject:branchUniversalObjectMap];
    BranchLinkProperties *linkProperties = [self createLinkProperties:linkPropertiesMap withControlParams:controlParamsMap];
    
    [branchUniversalObject getShortUrlWithLinkProperties:linkProperties andCallback:^(NSString *url, NSError *error) {
        if (!error) {
            NSLog(@"RNBranch Success");
            resolve(@{ @"url": url });
        } else {
            reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
        }
    }];
}

RCT_EXPORT_METHOD(
                  listOnSpotlight:(NSDictionary *)branchUniversalObjectMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    BranchUniversalObject *branchUniversalObject = [self createBranchUniversalObject:branchUniversalObjectMap];
    [branchUniversalObject listOnSpotlightWithCallback:^(NSString *string, NSError *error) {
        if (!error) {
            NSDictionary *data = @{@"result":string};
            resolve(data);
        } else {
            reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
        }
    }];
}

// @TODO can this be removed? legacy, short url should be created from BranchUniversalObject
RCT_EXPORT_METHOD(
                  getShortUrl:(NSDictionary *)linkPropertiesMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    NSString *feature = linkPropertiesMap[@"feature"];
    NSString *channel = linkPropertiesMap[@"channel"];
    NSString *stage = linkPropertiesMap[@"stage"];
    NSArray *tags = linkPropertiesMap[@"tags"];
    
    [branchInstance getShortURLWithParams:linkPropertiesMap
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

RCT_EXPORT_METHOD(
                  loadRewards:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    [branchInstance loadRewardsWithCallback:^(BOOL changed, NSError *error) {
        if(!error) {
            int credits = (int)[branchInstance getCredits];
            resolve(@{@"credits": @(credits)});
        } else {
            NSLog(@"Load Rewards Error: %@", error.localizedDescription);
            reject(@"RNBranch::Error::loadRewardsWithCallback", @"loadRewardsWithCallback", error);
        }
    }];
}

RCT_EXPORT_METHOD(
                  redeemRewards:(NSInteger *)amount
                  inBucket:(NSString *)bucket
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    if (bucket) {
        [branchInstance redeemRewards:amount forBucket:bucket callback:^(BOOL changed, NSError *error) {
            if (!error) {
                resolve(@{@"changed": @(changed)});
            } else {
                NSLog(@"Redeem Rewards Error: %@", error.localizedDescription);
                reject(@"RNBranch::Error::redeemRewards", error.localizedDescription, error);
            }
        }];
    } else {
        [branchInstance redeemRewards:amount callback:^(BOOL changed, NSError *error) {
            if (!error) {
                resolve(@{@"changed": @(changed)});
            } else {
                NSLog(@"Redeem Rewards Error: %@", error.localizedDescription);
                reject(@"RNBranch::Error::redeemRewards", error.localizedDescription, error);
            }
        }];
    }
}

RCT_EXPORT_METHOD(
                  getCreditHistory:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ){
    [branchInstance getCreditHistoryWithCallback:^(NSArray *list, NSError *error) {
        if (!error) {
            resolve(list);
        } else {
            NSLog(@"Credit History Error: %@", error.localizedDescription);
            reject(@"RNBranch::Error::getCreditHistory", error.localizedDescription, error);
        }
    }];
}

@end
