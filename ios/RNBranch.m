#import "RNBranch.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import "BranchEvent+RNBranch.h"
#import "BranchLinkProperties+RNBranch.h"
#import "BranchUniversalObject+RNBranch.h"
#import "RNBranchAgingDictionary.h"
#import "RNBranchEventEmitter.h"
#import <BranchSDK/NSError+Branch.h>

NSString * const RNBranchLinkOpenedNotification = @"RNBranchLinkOpenedNotification";
NSString * const RNBranchLinkOpenedNotificationErrorKey = @"error";
NSString * const RNBranchLinkOpenedNotificationParamsKey = @"params";
NSString * const RNBranchLinkOpenedNotificationUriKey = @"uri";
NSString * const RNBranchLinkOpenedNotificationBranchUniversalObjectKey = @"branch_universal_object";
NSString * const RNBranchLinkOpenedNotificationLinkPropertiesKey = @"link_properties";


static NSDictionary *initSessionWithLaunchOptionsResult;
static BOOL useTestInstance = NO;
static NSDictionary *savedLaunchOptions;
static BOOL savedIsReferrable;
static NSString *branchKey;
static BOOL deferInitializationForJSLoad = NO;
static NSURL *originalURL;

static NSString * const IdentFieldName = @"ident";

// These are only really exposed to the JS layer, so keep them internal for now.
static NSString * const RNBranchErrorDomain = @"RNBranchErrorDomain";
static NSInteger const RNBranchUniversalObjectNotFoundError = 1;

#pragma mark - Private RNBranch declarations

@interface RNBranch()
@property (nonatomic, readonly) UIViewController *currentViewController;
@property (nonatomic) RNBranchAgingDictionary<NSString *, BranchUniversalObject *> *universalObjectMap;

+ (void)willOpenURL:(NSURL * _Nullable)url;
@end

#pragma mark - RNBranch implementation

@implementation RNBranch

RCT_EXPORT_MODULE();

+ (Branch *)branch
{
    @synchronized(self) {
        static Branch *instance;
        static dispatch_once_t once = 0;
        dispatch_once(&once, ^{
            if (branchKey) {
                // Override the Info.plist if these are present.
                instance = [Branch getInstance: branchKey];
            }
            else {
                [Branch setUseTestBranchKey:useTestInstance];
                instance = [Branch getInstance];
            }
        });
        return instance;
    }
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSDictionary<NSString *, NSString *> *)constantsToExport {
    return @{
             // RN events transmitted to JS by event emitter
             @"INIT_SESSION_START": kRNBranchInitSessionStart,
             @"INIT_SESSION_SUCCESS": kRNBranchInitSessionSuccess,
             @"INIT_SESSION_ERROR": kRNBranchInitSessionError,

             // constants for use with BranchEvent

             // Commerce events
             @"STANDARD_EVENT_ADD_TO_CART": BranchStandardEventAddToCart,
             @"STANDARD_EVENT_ADD_TO_WISHLIST": BranchStandardEventAddToWishlist,
             @"STANDARD_EVENT_VIEW_CART": BranchStandardEventViewCart,
             @"STANDARD_EVENT_INITIATE_PURCHASE": BranchStandardEventInitiatePurchase,
             @"STANDARD_EVENT_ADD_PAYMENT_INFO": BranchStandardEventAddPaymentInfo,
             @"STANDARD_EVENT_PURCHASE": BranchStandardEventPurchase,
             @"STANDARD_EVENT_VIEW_AD": BranchStandardEventViewAd,
             @"STANDARD_EVENT_CLICK_AD": BranchStandardEventClickAd,

             // Content Events
             @"STANDARD_EVENT_SEARCH": BranchStandardEventSearch,
             @"STANDARD_EVENT_VIEW_ITEM": BranchStandardEventViewItem,
             @"STANDARD_EVENT_VIEW_ITEMS": BranchStandardEventViewItems,
             @"STANDARD_EVENT_RATE": BranchStandardEventRate,
             @"STANDARD_EVENT_SHARE": BranchStandardEventShare,

             // User Lifecycle Events
             @"STANDARD_EVENT_COMPLETE_REGISTRATION": BranchStandardEventCompleteRegistration,
             @"STANDARD_EVENT_COMPLETE_TUTORIAL": BranchStandardEventCompleteTutorial,
             @"STANDARD_EVENT_ACHIEVE_LEVEL": BranchStandardEventAchieveLevel,
             @"STANDARD_EVENT_UNLOCK_ACHIEVEMENT": BranchStandardEventUnlockAchievement,
             @"STANDARD_EVENT_INVITE": BranchStandardEventInvite,
             @"STANDARD_EVENT_LOGIN": BranchStandardEventLogin,
             @"STANDARD_EVENT_RESERVE": BranchStandardEventReserve,
             @"STANDARD_EVENT_SUBSCRIBE": BranchStandardEventSubscribe,
             @"STANDARD_EVENT_START_TRIAL": BranchStandardEventStartTrial
             };
}

#pragma mark - Class methods

+ (void)setDebug
{
    [self.branch setDebug];
}

+ (void)enableLogging
{
    [self.branch enableLogging];
}

+ (void)delayInitToCheckForSearchAds
{
    [self.branch delayInitToCheckForSearchAds];
}

+ (void)useTestInstance {
    useTestInstance = YES;
}

+ (void)deferInitializationForJSLoad
{
    deferInitializationForJSLoad = YES;
}

//Called by AppDelegate.m -- stores initSession result in static variables and posts RNBranchLinkOpened event that's captured by the RNBranch instance to emit it to React Native
+ (void)initSessionWithLaunchOptions:(NSDictionary *)launchOptions isReferrable:(BOOL)isReferrable {
    savedLaunchOptions = launchOptions;
    savedIsReferrable = isReferrable;

    [self.branch registerPluginName:@"ReactNative" version:RNBRANCH_VERSION];

    // Can't currently support this on Android.
    // if (!deferInitializationForJSLoad && !BranchJsonConfig.instance.deferInitializationForJSLoad) [self initializeBranchSDK];
    [self initializeBranchSDK];
}

+ (void)initializeBranchSDK
{
    // Universal Links
    NSUserActivity *coldLaunchUserActivity = savedLaunchOptions[UIApplicationLaunchOptionsUserActivityDictionaryKey][@"UIApplicationLaunchOptionsUserActivityKey"];
    if (coldLaunchUserActivity.webpageURL) {
        [self willOpenURL:coldLaunchUserActivity.webpageURL];
    }

    // URI schemes
    NSURL *coldLaunchURL = savedLaunchOptions[UIApplicationLaunchOptionsURLKey];
    if (coldLaunchURL) {
        [self willOpenURL:coldLaunchURL];
    }

    [self.branch initSessionWithLaunchOptions:savedLaunchOptions isReferrable:savedIsReferrable andRegisterDeepLinkHandler:^(NSDictionary *params, NSError *error) {
        NSMutableDictionary *result = [NSMutableDictionary dictionary];
        if (error) result[RNBranchLinkOpenedNotificationErrorKey] = error;
        if (params) {
            result[RNBranchLinkOpenedNotificationParamsKey] = params;
            BOOL clickedBranchLink = [params[@"+clicked_branch_link"] boolValue];

            if (clickedBranchLink) {
                BranchUniversalObject *branchUniversalObject = [BranchUniversalObject objectWithDictionary:params];
                if (branchUniversalObject) result[RNBranchLinkOpenedNotificationBranchUniversalObjectKey] = branchUniversalObject;

                BranchLinkProperties *linkProperties = [BranchLinkProperties getBranchLinkPropertiesFromDictionary:params];
                if (linkProperties) result[RNBranchLinkOpenedNotificationLinkPropertiesKey] = linkProperties;
            }
        }

        /*
         * originalURL will be nil in case of deferred deep links, Spotlight items, etc.
         * Note that deferred deep link checks will not trigger an onOpenStart call in JS
         * (RNBranch.INIT_SESSION_START).
         */
        if (originalURL) {
            result[RNBranchLinkOpenedNotificationUriKey] = originalURL;
            originalURL = nil;
        }

        [[NSNotificationCenter defaultCenter] postNotificationName:RNBranchLinkOpenedNotification object:nil userInfo:result];
    }];
}

+ (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    [self willOpenURL:url];
    return [self.branch application:application openURL:url options:options];
}

+ (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    [self willOpenURL:url];
    return [self.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
+ (BOOL)continueUserActivity:(NSUserActivity *)userActivity {
    [self willOpenURL:userActivity.webpageURL];
    return [self.branch continueUserActivity:userActivity];
}
#pragma clang diagnostic pop

+ (void)willOpenURL:(NSURL *)url
{
    /*
     * This should be consistent with the behavior of the underlying SDK.
     * If an open is pending, and a new open is received, the first open is
     * dropped. No response is expected for the first open. JS will generate
     * two calls to onOpenStart with potentially different URIs. Only the
     * last one should be expected to get a response.
     *
     * Behavior on Android is probably different.
     */
    originalURL = url;
    [RNBranchEventEmitter initSessionWillStartWithURI:url];
}

#pragma mark - Object lifecycle

- (instancetype)init {
    self = [super init];

    if (self) {
        _universalObjectMap = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onInitSessionFinished:) name:RNBranchLinkOpenedNotification object:nil];
    }

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
    NSURL *uri = notification.userInfo[RNBranchLinkOpenedNotificationUriKey];
    NSError *error = notification.userInfo[RNBranchLinkOpenedNotificationErrorKey];
    NSDictionary *params = notification.userInfo[RNBranchLinkOpenedNotificationParamsKey];

    initSessionWithLaunchOptionsResult = @{
                                           RNBranchLinkOpenedNotificationErrorKey: error.localizedDescription ?: NSNull.null,
                                           RNBranchLinkOpenedNotificationParamsKey: params ?: NSNull.null,
                                           RNBranchLinkOpenedNotificationUriKey: uri.absoluteString ?: NSNull.null
                                           };

    // If there is an error, fire error event
    if (error) {
        [RNBranchEventEmitter initSessionDidEncounterErrorWithPayload:initSessionWithLaunchOptionsResult];
    }

    // otherwise notify the session is finished
    else {
        [RNBranchEventEmitter initSessionDidSucceedWithPayload:initSessionWithLaunchOptionsResult];
    }
}

- (BranchLinkProperties*) createLinkProperties:(NSDictionary *)linkPropertiesMap withControlParams:(NSDictionary *)controlParamsMap
{
    BranchLinkProperties *linkProperties = [[BranchLinkProperties alloc] initWithMap:linkPropertiesMap];

    linkProperties.controlParams = controlParamsMap;
    return linkProperties;
}

- (BranchUniversalObject *)findUniversalObjectWithIdent:(NSString *)ident rejecter:(RCTPromiseRejectBlock)reject
{
    BranchUniversalObject *universalObject = self.universalObjectMap[ident];

    if (!universalObject) {
        NSString *errorMessage = [NSString stringWithFormat:@"BranchUniversalObject for ident %@ not found.", ident];

        NSError *error = [NSError errorWithDomain:RNBranchErrorDomain
                                             code:RNBranchUniversalObjectNotFoundError
                                         userInfo:@{IdentFieldName : ident,
                                                    NSLocalizedDescriptionKey: errorMessage
                                                    }];

        reject(@"RNBranch::Error::BUONotFound", errorMessage, error);
    }

    return universalObject;
}

#pragma mark - Methods exported to React Native


#pragma mark clearPartnerParameters
RCT_EXPORT_METHOD(
                  clearPartnerParameters
                  ) {
    [self.class.branch clearPartnerParameters];
}

#pragma mark addFacebookPartnerParameter
RCT_EXPORT_METHOD(
                  addFacebookPartnerParameter:(NSString *)name
                  value:(NSString *)value
                  ) {
    [self.class.branch addFacebookPartnerParameterWithName:name value:value];
}

#pragma mark disableTracking
RCT_EXPORT_METHOD(
                  disableTracking:(BOOL)disable
                  ) {
    [Branch setTrackingDisabled: disable];
}

#pragma mark isTrackingDisabled
RCT_EXPORT_METHOD(
                  isTrackingDisabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    resolve([Branch trackingDisabled] ? @YES : @NO);
}

#pragma mark initializeBranch
RCT_EXPORT_METHOD(initializeBranch:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    NSError *error = [NSError errorWithDomain:RNBranchErrorDomain
                                         code:-1
                                     userInfo:nil];

    reject(@"RNBranch::Error::Unsupported", @"Initializing the Branch SDK from JS will be supported in a future release.", error);

    /*
    if (!deferInitializationForJSLoad && !BranchJsonConfig.instance.deferInitializationForJSLoad) {
        // This is a no-op from JS unless [RNBranch deferInitializationForJSLoad] is called.
        resolve(0);
        return;
    }

    RCTLogTrace(@"Initializing Branch SDK. Key from JS: %@", key);
    branchKey = key;

    [self.class initializeBranchSDK];
    resolve(0);
    // */
}

#pragma mark redeemInitSessionResult
RCT_EXPORT_METHOD(
                  redeemInitSessionResult:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    resolve(initSessionWithLaunchOptionsResult ?: [NSNull null]);
}

#pragma mark getLatestReferringParams
RCT_EXPORT_METHOD(
                  getLatestReferringParams:(NSNumber* __nonnull)synchronous
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    if (synchronous.boolValue)
        resolve([self.class.branch getLatestReferringParamsSynchronous]);
    else
        resolve([self.class.branch getLatestReferringParams]);
}

#pragma mark getFirstReferringParams
RCT_EXPORT_METHOD(
                  getFirstReferringParams:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    resolve([self.class.branch getFirstReferringParams]);
}

#pragma mark lastAttributedTouchData
RCT_EXPORT_METHOD(
                  lastAttributedTouchData:(NSNumber* __nonnull)window
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    [self.class.branch lastAttributedTouchDataWithAttributionWindow:window.integerValue completion:^(BranchLastAttributedTouchData *data, NSError *error){
        if (!error) {
            resolve(data.lastAttributedTouchJSON);
        } else {
            reject(@"RNBranch::Error::lastAttributedTouchData failed", error.localizedDescription, error);
        }

    }];
}

#pragma mark setIdentity
RCT_EXPORT_METHOD(
                  setIdentity:(NSString *)identity
                  ) {
    [self.class.branch setIdentity:identity];
}

#pragma mark setIdentityAsync
RCT_EXPORT_METHOD(
                  setIdentityAsync:(NSString *)identity
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    [self.class.branch setIdentity: identity withCallback:^(NSDictionary *params, NSError *error) {
        if (!error) {
            resolve(params);
        } else {
            reject(@"RNBranch::Error::setIdentityAsync failed", error.localizedDescription, error);
        }
    }];
}

#pragma mark setRequestMetadataKey
RCT_EXPORT_METHOD(
                  setRequestMetadataKey:(NSString *)key
                  value:(NSString *)value
                  ) {
    [self.class.branch setRequestMetadataKey:key value:value];
}

#pragma mark logout
RCT_EXPORT_METHOD(
                  logout
                  ) {
    [self.class.branch logout];
}

#pragma mark openURL
RCT_EXPORT_METHOD(
                  openURL:(NSString *)urlString
                  ) {
    [self.class.branch handleDeepLinkWithNewSession:[NSURL URLWithString:urlString]];
}

#pragma mark notifyNativeToInit
RCT_EXPORT_METHOD(
                  notifyNativeToInit
                  ) {
    [self.class.branch notifyNativeToInit];
}

#pragma mark sendCommerceEvent
RCT_EXPORT_METHOD(
                  sendCommerceEvent:(NSString *)revenue
                  metadata:(NSDictionary *)metadata
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    BNCCommerceEvent *commerceEvent = [BNCCommerceEvent new];
    commerceEvent.revenue = [NSDecimalNumber decimalNumberWithString:revenue];
    [self.class.branch sendCommerceEvent:commerceEvent metadata:metadata withCompletion:^(NSDictionary *r, NSError *e){}];
    resolve(NSNull.null);
}

#pragma mark userCompletedAction
RCT_EXPORT_METHOD(
                  userCompletedAction:(NSString *)event withState:(NSDictionary *)appState
                  ) {
    [self.class.branch userCompletedAction:event withState:appState];
}

#pragma mark userCompletedActionOnUniversalObject
RCT_EXPORT_METHOD(
                  userCompletedActionOnUniversalObject:(NSString *)identifier
                  event:(NSString *)event
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

    [branchUniversalObject userCompletedAction:event];
    resolve(NSNull.null);
}

#pragma mark userCompletedActionOnUniversalObject
RCT_EXPORT_METHOD(
                  userCompletedActionOnUniversalObject:(NSString *)identifier
                  event:(NSString *)event
                  state:(NSDictionary *)state
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

    [branchUniversalObject userCompletedAction:event withState:state];
    resolve(NSNull.null);
}

#pragma mark logEvent
RCT_EXPORT_METHOD(
                  logEvent:(NSArray *)identifiers
                  eventName:(NSString *)eventName
                  params:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchEvent *event = [[BranchEvent alloc] initWithName:eventName map:params];

    NSMutableArray<BranchUniversalObject *> *buos = @[].mutableCopy;
    for (NSString *identifier in identifiers) {
        BranchUniversalObject *buo = [self findUniversalObjectWithIdent:identifier rejecter:reject];
        if (!buo) return;

        [buos addObject:buo];
    }

    event.contentItems = buos;
    if ([eventName isEqualToString:BranchStandardEventViewItem] && params.count == 0) {
        for (BranchUniversalObject *buo in buos) {
            if (!buo.locallyIndex) continue;
            // for now at least, pending possible changes to the native SDK
            [buo listOnSpotlight];
        }
    }

    [event logEvent];
    resolve(NSNull.null);
}

#pragma mark showShareSheet
RCT_EXPORT_METHOD(
                  showShareSheet:(NSString *)identifier
                  withShareOptions:(NSDictionary *)shareOptionsMap
                  withLinkProperties:(NSDictionary *)linkPropertiesMap
                  withControlParams:(NSDictionary *)controlParamsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

    dispatch_async(dispatch_get_main_queue(), ^{
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

                                                // SDK-854 do not callback more than once.
                                                // The native iOS code calls back with status even if the user just cancelled.
                                                if (completed) {
                                                    resolve(result);
                                                }
                                            }];
    });
}

#pragma mark registerView
RCT_EXPORT_METHOD(
                  registerView:(NSString *)identifier
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

    [branchUniversalObject registerViewWithCallback:^(NSDictionary *params, NSError *error) {
        if (!error) {
            resolve([NSNull null]);
        } else {
            reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
        }
    }];
}

#pragma mark generateShortUrl
RCT_EXPORT_METHOD(
                  generateShortUrl:(NSString *)identifier
                  withLinkProperties:(NSDictionary *)linkPropertiesMap
                  withControlParams:(NSDictionary *)controlParamsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

    BranchLinkProperties *linkProperties = [self createLinkProperties:linkPropertiesMap withControlParams:controlParamsMap];

    [branchUniversalObject getShortUrlWithLinkProperties:linkProperties andCallback:^(NSString *url, NSError *error) {
        if (!error) {
            RCTLogInfo(@"RNBranch Success");
            resolve(@{ @"url": url });
        }
        else if (error.code == BNCDuplicateResourceError) {
            reject(@"RNBranch::Error::DuplicateResourceError", error.localizedDescription, error);
        }
        else {
            reject(@"RNBranch::Error", error.localizedDescription, error);
        }
    }];
}

#pragma mark listOnSpotlight
RCT_EXPORT_METHOD(
                  listOnSpotlight:(NSString *)identifier
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *branchUniversalObject = [self findUniversalObjectWithIdent:identifier rejecter:reject];
    if (!branchUniversalObject) return;

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
#pragma mark getShortUrl
RCT_EXPORT_METHOD(
                  getShortUrl:(NSDictionary *)linkPropertiesMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    NSString *feature = linkPropertiesMap[@"feature"];
    NSString *channel = linkPropertiesMap[@"channel"];
    NSString *stage = linkPropertiesMap[@"stage"];
    NSArray *tags = linkPropertiesMap[@"tags"];

    [self.class.branch getShortURLWithParams:linkPropertiesMap
                                  andTags:tags
                               andChannel:channel
                               andFeature:feature
                                 andStage:stage
                              andCallback:^(NSString *url, NSError *error) {
                                  if (error) {
                                      RCTLogError(@"RNBranch::Error: %@", error.localizedDescription);
                                      reject(@"RNBranch::Error", @"getShortURLWithParams", error);
                                  }
                                  resolve(url);
                              }];
}

#pragma mark createUniversalObject
RCT_EXPORT_METHOD(
                  createUniversalObject:(NSDictionary *)universalObjectProperties
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject
                  ) {
    BranchUniversalObject *universalObject = [[BranchUniversalObject alloc] initWithMap:universalObjectProperties];
    NSString *identifier = [NSUUID UUID].UUIDString;
    self.universalObjectMap[identifier] = universalObject;
    NSDictionary *response = @{IdentFieldName: identifier};

    resolve(response);
}

#pragma mark releaseUniversalObject
RCT_EXPORT_METHOD(
                  releaseUniversalObject:(NSString *)identifier
                  ) {
    [self.universalObjectMap removeObjectForKey:identifier];
}

#pragma mark handleATTAuthorizationStatus
RCT_EXPORT_METHOD(
                  handleATTAuthorizationStatus:(NSUInteger)authorizationStatus
                  ) {
    [self.class.branch handleATTAuthorizationStatus:authorizationStatus];
}

#pragma mark getBranchQRCode
RCT_EXPORT_METHOD(
                  getBranchQRCode:(NSDictionary *)qrCodeSettingsMap
                  withUniversalObject:(NSDictionary *)universalObjectProperties
                  withLinkProperties:(NSDictionary *)linkPropertiesMap
                  withControlParams:(NSDictionary *)controlParamsMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {

    BranchLinkProperties *linkProperties = [self createLinkProperties:linkPropertiesMap withControlParams:controlParamsMap];
    BranchUniversalObject *universalObject = [[BranchUniversalObject alloc] initWithMap:universalObjectProperties];
    
    BranchQRCode *qrCode = [BranchQRCode new];
    
    if (qrCodeSettingsMap[@"codeColor"]) {
        qrCode.codeColor = [self colorWithHexString:qrCodeSettingsMap[@"codeColor"]];
    }
    if (qrCodeSettingsMap[@"backgroundColor"]) {
        qrCode.backgroundColor = [self colorWithHexString:qrCodeSettingsMap[@"backgroundColor"]];
    }
    if (qrCodeSettingsMap[@"centerLogo"]) {
        qrCode.centerLogo = qrCodeSettingsMap[@"centerLogo"];
    }
    if (qrCodeSettingsMap[@"width"]) {
        qrCode.width = qrCodeSettingsMap[@"width"];
    }
    if (qrCodeSettingsMap[@"margin"]) {
        qrCode.margin = qrCodeSettingsMap[@"margin"];
    }
    if (qrCodeSettingsMap[@"imageFormat"]) {
        if ([qrCodeSettingsMap[@"imageFormat"] isEqual:@"JPEG"]) {
            qrCode.imageFormat = BranchQRCodeImageFormatJPEG;
        } else {
            qrCode.imageFormat = BranchQRCodeImageFormatPNG;
        }
    }
    
    [qrCode getQRCodeAsData:universalObject linkProperties:linkProperties completion:^(NSData * _Nonnull qrCodeData, NSError * _Nonnull error) {
        if (!error) {
            NSString* imageString = [qrCodeData base64EncodedStringWithOptions:nil];
            resolve(imageString);
        } else {
            reject(@"RNBranch::Error", error.localizedDescription, error);
        }
    }];
}

- (UIColor *) colorWithHexString: (NSString *) hexString {
    NSString *colorString = [[hexString stringByReplacingOccurrencesOfString: @"#" withString: @""] uppercaseString];
    CGFloat alpha, red, blue, green;
    switch ([colorString length]) {
        case 3: // #RGB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 1];
            green = [self colorComponentFrom: colorString start: 1 length: 1];
            blue  = [self colorComponentFrom: colorString start: 2 length: 1];
            break;
        case 4: // #ARGB
            alpha = [self colorComponentFrom: colorString start: 0 length: 1];
            red   = [self colorComponentFrom: colorString start: 1 length: 1];
            green = [self colorComponentFrom: colorString start: 2 length: 1];
            blue  = [self colorComponentFrom: colorString start: 3 length: 1];          
            break;
        case 6: // #RRGGBB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 2];
            green = [self colorComponentFrom: colorString start: 2 length: 2];
            blue  = [self colorComponentFrom: colorString start: 4 length: 2];                      
            break;
        case 8: // #AARRGGBB
            alpha = [self colorComponentFrom: colorString start: 0 length: 2];
            red   = [self colorComponentFrom: colorString start: 2 length: 2];
            green = [self colorComponentFrom: colorString start: 4 length: 2];
            blue  = [self colorComponentFrom: colorString start: 6 length: 2];                      
            break;
        default:
            RCTLogError(@"RNBranch::Error: Invalid color value. It should be a hex value of the form #RBG, #ARGB, #RRGGBB, or #AARRGGBB");
            break;
    }
    return [UIColor colorWithRed: red green: green blue: blue alpha: alpha];
}

- (CGFloat) colorComponentFrom: (NSString *) string start: (NSUInteger) start length: (NSUInteger) length {
    NSString *substring = [string substringWithRange: NSMakeRange(start, length)];
    NSString *fullHex = length == 2 ? substring : [NSString stringWithFormat: @"%@%@", substring, substring];
    unsigned hexComponent;
    [[NSScanner scannerWithString: fullHex] scanHexInt: &hexComponent];
    return hexComponent / 255.0;
}

@end
