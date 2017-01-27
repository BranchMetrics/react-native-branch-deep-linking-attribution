//
//  NSObject+RNBranch.m
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import "RCTLog.h"

#import "NSObject+RNBranch.h"
#import "RNBranchProperty.h"

@implementation NSObject(RNBranch)

+ (NSDictionary<NSString *,RNBranchProperty *> *)supportedProperties
{
    return @{};
}

- (void)setSupportedPropertiesWithMap:(NSDictionary *)map
{
    for (NSString *key in map.allKeys) {
        RNBranchProperty *property = self.class.supportedProperties[key];
        if (!property) {
            RCTLogWarn(@"\"%@\" is not a supported property for %@.", key, NSStringFromClass(self.class));
            continue;
        }
        
        id value = map[key];
        Class type = property.type;
        if (![value isKindOfClass:type]) {
            RCTLogWarn(@"\"%@\" requires a value of type %@.", key, NSStringFromClass(type));
            continue;
        }
        
        SEL setterSelector = property.setterSelector;
        if (![self respondsToSelector:setterSelector]) {
            RCTLogWarn(@"\"%@\" is not supported by the installed version of the native Branch SDK for objects of type %@. Please update to the current release using \"pod update\" or \"carthage update\".", key, NSStringFromClass(self.class));
            continue;
        }
        
        [self performSelector:setterSelector withObject:value];
    }
}

@end
