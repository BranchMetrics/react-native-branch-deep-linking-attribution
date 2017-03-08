//
//  RNBranchAgingDictionary.h
//  RNBranch
//
//  Created by Jimmy Dee on 3/8/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RNBranchAgingItem;

@interface RNBranchAgingDictionary<KeyType, ObjectType> : NSObject

@property (nonatomic, readonly) NSTimeInterval ttl;

- (instancetype)initWithTtl:(NSTimeInterval)ttl NS_DESIGNATED_INITIALIZER;

+ (instancetype)dictionaryWithTtl:(NSTimeInterval)ttl;

- (void)setObject:(ObjectType)object forKey:(KeyType<NSCopying>)key;
- (void)setObject:(ObjectType)object forKeyedSubscript:(KeyType<NSCopying>)key;

- (nullable ObjectType)objectForKey:(KeyType)key;
- (nullable ObjectType)objectForKeyedSubscript:(KeyType)key;

- (void)removeObjectForKey:(KeyType)key;

@end
