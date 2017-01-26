//
//  RNBranchProperty.m
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Dispatcher. All rights reserved.
//

#import "RNBranchProperty.h"
#import "BranchUniversalObject+RNBranch.h"

@interface RNBranchProperty()
@property (nonatomic) SEL setterSelector;
@property (nonatomic) Class type;

+ (void)setProperties:(NSDictionary<NSString *, RNBranchProperty *> *)properties onObject:(NSObject *)object fromMap:(NSDictionary *)map;

+ (NSDictionary<NSString *, RNBranchProperty *> *)linkProperties;
+ (NSDictionary<NSString *, RNBranchProperty *> *)universalObjectProperties;

+ (instancetype) propertyWithSetterSelector:(SEL)selector type:(Class)type;

- (instancetype) initWithSetterSelector:(SEL)selector type:(Class)type NS_DESIGNATED_INITIALIZER;
@end

@implementation RNBranchProperty

+ (void)setLinkPropertiesOn:(BranchLinkProperties *)linkProperties fromMap:(NSDictionary *)map
{
    [self setProperties:self.linkProperties onObject:linkProperties fromMap:map];
}

+ (void)setUniversalObjectPropertiesOn:(BranchUniversalObject *)universalObject fromMap:(NSDictionary *)map
{
    [self setProperties:self.universalObjectProperties onObject:universalObject fromMap:map];
}

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
      @"contentIndexingMode": [self propertyWithSetterSelector:@selector(setContentIndexingMode:) type:NSString.class],
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

+ (void)setProperties:(NSDictionary<NSString *, RNBranchProperty *> *)properties onObject:(NSObject *)object fromMap:(NSDictionary *)map
{
    for (NSString *key in map.allKeys) {
        RNBranchProperty *property = properties[key];
        if (!property) {
            NSLog(@"\"%@\" is not a supported link property.", key);
            continue;
        }

        id value = map[key];
        Class type = property.type;
        if (![value isKindOfClass:type]) {
            NSLog(@"\"%@\" requires a value of type %@.", key, NSStringFromClass(type));
            continue;
        }

        SEL setterSelector = property.setterSelector;
        if (![object respondsToSelector:setterSelector]) {
            NSLog(@"\"%@\" is not supported by the installed version of the native Branch SDK for objects of type %@. Please update to the current release using \"pod update\" or \"carthage update\".", key, NSStringFromClass(object.class));
            continue;
        }

        [object performSelector:setterSelector withObject:value];
    }
}

@end
