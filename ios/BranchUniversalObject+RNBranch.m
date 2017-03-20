//
//  BranchUniversalObject+RNBranch.m
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <React/RCTLog.h>

#import "BranchUniversalObject+RNBranch.h"
#import "NSObject+RNBranch.h"
#import "RNBranchProperty.h"

@implementation BranchUniversalObject(RNBranch)

+ (NSDictionary<NSString *,RNBranchProperty *> *)supportedProperties
{
    static NSDictionary<NSString *, RNBranchProperty *> *_universalObjectProperties;
    static dispatch_once_t once = 0;
    dispatch_once(&once, ^{
        _universalObjectProperties =
        @{
          @"automaticallyListOnSpotlight": [RNBranchProperty propertyWithSetterSelector:@selector(setAutomaticallyListOnSpotlightWithNumber:) type:NSNumber.class],
          @"canonicalUrl": [RNBranchProperty propertyWithSetterSelector:@selector(setCanonicalUrl:) type:NSString.class],
          @"contentDescription": [RNBranchProperty propertyWithSetterSelector:@selector(setContentDescription:) type:NSString.class],
          @"contentImageUrl": [RNBranchProperty propertyWithSetterSelector:@selector(setImageUrl:) type:NSString.class],
          @"contentIndexingMode": [RNBranchProperty propertyWithSetterSelector:@selector(setContentIndexingMode:) type:NSString.class],
          @"currency": [RNBranchProperty propertyWithSetterSelector:@selector(setCurrency:) type:NSString.class],
          @"expirationDate": [RNBranchProperty propertyWithSetterSelector:@selector(setExpirationDateWithString:) type:NSString.class],
          @"keywords": [RNBranchProperty propertyWithSetterSelector:@selector(setKeywords:) type:NSArray.class],
          @"metadata": [RNBranchProperty propertyWithSetterSelector:@selector(setMetadata:) type:NSDictionary.class],
          @"price": [RNBranchProperty propertyWithSetterSelector:@selector(setPriceWithNumber:) type:NSNumber.class],
          @"title": [RNBranchProperty propertyWithSetterSelector:@selector(setTitle:) type:NSString.class],
          @"type": [RNBranchProperty propertyWithSetterSelector:@selector(setType:) type:NSString.class]
          };
    });
    
    return _universalObjectProperties;
}

- (instancetype)initWithMap:(NSDictionary *)map
{
    NSString *canonicalIdentifier = map[@"canonicalIdentifier"];
    NSMutableDictionary *mutableMap = map.mutableCopy;
    [mutableMap removeObjectForKey:@"canonicalIdentifier"];

    self = [self initWithCanonicalIdentifier:canonicalIdentifier];
    if (self) {
        [self setSupportedPropertiesWithMap:mutableMap];
    }
    return self;
}

- (void)setContentIndexingMode:(NSString *)contentIndexingMode
{
    SEL selector = @selector(setContentIndexMode:);

    if (![self respondsToSelector:selector]) {
        RCTLogWarn(@"\"contentIndexingMode\" is not supported by the installed version of the native Branch SDK for objects of type BranchUniversalObject. Please update to the current release using \"pod update\" or \"carthage update\".");
        return;
    }

    if ([contentIndexingMode isEqualToString:@"private"]) {
        [self performSelector:selector withObject:@(ContentIndexModePrivate)];
    }
    else if ([contentIndexingMode isEqualToString:@"public"]) {
        [self performSelector:selector withObject:@(ContentIndexModePublic)];
    }
    else {
        RCTLogWarn(@"Invalid value \"%@\" for \"contentIndexingMode\". Supported values are \"public\" and \"private\".", contentIndexingMode);
    }
}

- (void)setPriceWithNumber:(NSNumber *)price
{
    self.price = price.floatValue;
}

- (void)setAutomaticallyListOnSpotlightWithNumber:(NSNumber *)flag
{
    self.automaticallyListOnSpotlight = flag.boolValue;
}

- (void)setExpirationDateWithString:(NSString *)expirationDate
{
    struct tm expiration;
    if (!strptime(expirationDate.UTF8String, "%Y-%m-%dT%H:%M:%S", &expiration)) {
        RCTLogWarn(@"Invalid expiration date format. Valid format is YYYY-mm-ddTHH:MM:SS, e.g. 2017-02-01T00:00:00. All times UTC.");
        return;
    }

    self.expirationDate = [NSDate dateWithTimeIntervalSince1970:timegm(&expiration)];
}

#pragma mark - Code to support userCompletedAction:withState:

/*
 * Until the native SDK supports this, the following is largely lifted from BUO.m.
 */

//* From BranchConstants.h
static NSString * const BRANCH_LINK_DATA_KEY_CANONICAL_IDENTIFIER = @"$canonical_identifier";
static NSString * const BRANCH_LINK_DATA_KEY_CANONICAL_URL = @"$canonical_url";
static NSString * const BRANCH_LINK_DATA_KEY_OG_TITLE = @"$og_title";
static NSString * const BRANCH_LINK_DATA_KEY_OG_DESCRIPTION = @"$og_description";
static NSString * const BRANCH_LINK_DATA_KEY_OG_IMAGE_URL = @"$og_image_url";
static NSString * const BRANCH_LINK_DATA_KEY_PUBLICLY_INDEXABLE = @"$publicly_indexable";
static NSString * const BRANCH_LINK_DATA_KEY_KEYWORDS = @"$keywords";
static NSString * const BRANCH_LINK_DATA_KEY_CONTENT_EXPIRATION_DATE = @"$exp_date";
static NSString * const BRANCH_LINK_DATA_KEY_CONTENT_TYPE = @"$content_type";

- (void)rnbranchUserCompletedAction:(NSString *)action withState:(NSDictionary *)state
{
    // Anticipate that the native SDK will support this.
    SEL sdkMethod = @selector(userCompletedAction:withState:);
    if ([self respondsToSelector:sdkMethod]) {
        [self performSelector:sdkMethod withObject:action withObject:state];
        return;
    }

    NSMutableDictionary *actionPayload = [[NSMutableDictionary alloc] init];
    NSDictionary *linkParams = [self getParamsForServerRequest];
    if (self.canonicalIdentifier && linkParams) {
        actionPayload[BNCCanonicalIdList] = @[self.canonicalIdentifier];
        actionPayload[self.canonicalIdentifier] = linkParams;

        // Add in custom params
        [actionPayload addEntriesFromDictionary:state];

        [[Branch getInstance] userCompletedAction:action withState:actionPayload];
        if (self.automaticallyListOnSpotlight && [action isEqualToString:BNCRegisterViewEvent])
            [self listOnSpotlight];
    }
}

- (NSDictionary *)getParamsForServerRequest {
    NSMutableDictionary *temp = [[NSMutableDictionary alloc] init];
    [self safeSetValue:self.canonicalIdentifier forKey:BRANCH_LINK_DATA_KEY_CANONICAL_IDENTIFIER onDict:temp];
    [self safeSetValue:self.canonicalUrl forKey:BRANCH_LINK_DATA_KEY_CANONICAL_URL onDict:temp];
    [self safeSetValue:self.title forKey:BRANCH_LINK_DATA_KEY_OG_TITLE onDict:temp];
    [self safeSetValue:self.contentDescription forKey:BRANCH_LINK_DATA_KEY_OG_DESCRIPTION onDict:temp];
    [self safeSetValue:self.imageUrl forKey:BRANCH_LINK_DATA_KEY_OG_IMAGE_URL onDict:temp];
    if (self.contentIndexMode == ContentIndexModePrivate) {
        [self safeSetValue:@(0) forKey:BRANCH_LINK_DATA_KEY_PUBLICLY_INDEXABLE onDict:temp];
    }
    else {
        [self safeSetValue:@(1) forKey:BRANCH_LINK_DATA_KEY_PUBLICLY_INDEXABLE onDict:temp];
    }
    [self safeSetValue:self.keywords forKey:BRANCH_LINK_DATA_KEY_KEYWORDS onDict:temp];
    [self safeSetValue:@(1000 * [self.expirationDate timeIntervalSince1970]) forKey:BRANCH_LINK_DATA_KEY_CONTENT_EXPIRATION_DATE onDict:temp];
    [self safeSetValue:self.type forKey:BRANCH_LINK_DATA_KEY_CONTENT_TYPE onDict:temp];
    [self safeSetValue:self.currency forKey:BNCPurchaseCurrency onDict:temp];
    if (self.price) {
        // have to add if statement because safeSetValue only accepts objects so even if self.price is not set
        // a valid NSNumber object will be created and the request will have amount:0 in all cases.
        [self safeSetValue:[NSNumber numberWithFloat:self.price] forKey:BNCPurchaseAmount onDict:temp];
    }

    [temp addEntriesFromDictionary:[self.metadata copy]];
    return [temp copy];
}

- (void)safeSetValue:(NSObject *)value forKey:(NSString *)key onDict:(NSMutableDictionary *)dict {
    if (value) {
        dict[key] = value;
    }
}

@end
