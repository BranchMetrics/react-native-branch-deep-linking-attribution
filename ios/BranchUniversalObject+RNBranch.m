//
//  BranchUniversalObject+RNBranch.m
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Dispatcher. All rights reserved.
//

#import "RCTLog.h"

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
          @"canonicalUrl": [RNBranchProperty propertyWithSetterSelector:@selector(setCanonicalUrl:) type:NSString.class],
          @"contentDescription": [RNBranchProperty propertyWithSetterSelector:@selector(setContentDescription:) type:NSString.class],
          @"contentImageUrl": [RNBranchProperty propertyWithSetterSelector:@selector(setImageUrl:) type:NSString.class],
          @"contentIndexingMode": [RNBranchProperty propertyWithSetterSelector:@selector(setContentIndexingMode:) type:NSString.class],
          @"metadata": [RNBranchProperty propertyWithSetterSelector:@selector(setMetadata:) type:NSDictionary.class],
          @"title": [RNBranchProperty propertyWithSetterSelector:@selector(setTitle:) type:NSString.class]
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

@end
