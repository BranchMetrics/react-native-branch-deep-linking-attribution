//
//  RNBranchAgingDictionary.m
//  RNBranch
//
//  Created by Jimmy Dee on 3/8/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import "RNBranchAgingDictionary.h"
#import "RNBranchAgingItem.h"

@interface RNBranchAgingDictionary()
@property (nonatomic) NSMutableDictionary *dictionary;
@end

@implementation RNBranchAgingDictionary

#pragma mark - Object lifecycle

+ (instancetype)dictionaryWithTtl:(NSTimeInterval)ttl
{
    return [[self alloc] initWithTtl:ttl];
}

- (instancetype)initWithTtl:(NSTimeInterval)ttl
{
    self = [super init];
    if (self) {
        _ttl = ttl;
        _dictionary = [NSMutableDictionary dictionary];
    }
    return self;
}

#pragma mark - Overrides from superclass

- (void)setObject:(id)anObject forKey:(id<NSCopying>)aKey
{
    [self insertItem:anObject forKey:aKey];
}

- (void)setObject:(id)obj forKeyedSubscript:(id<NSCopying>)key
{
    [self insertItem:obj forKey:key];
}

- (id)objectForKey:(id)aKey
{
    return [self itemForKey:aKey];
}

- (id)objectForKeyedSubscript:(id)key
{
    return [self itemForKey:key];
}

- (void)removeObjectForKey:(id)key
{
    [self.dictionary removeObjectForKey:key];
}

#pragma mark - Internal utilities

- (void)insertItem:(id)obj forKey:(id<NSCopying>)key
{
    [self ageItems];

    RNBranchAgingItem *item = [[RNBranchAgingItem alloc] initWithItem:obj];
    [self.dictionary setObject:item forKeyedSubscript:key];
}

- (id)itemForKey:(id)key
{
    RNBranchAgingItem *item = [self.dictionary objectForKey:key];
    return item.item;
}

- (void)ageItems
{
    NSTimeInterval now = [NSDate date].timeIntervalSince1970;

    for (NSString *key in self.dictionary.allKeys) {
        RNBranchAgingItem *item = [self.dictionary objectForKey:key];
        if ((now - item.accessTime) >= self.ttl) {
            [self.dictionary removeObjectForKey:key];
        }
    }
}

@end
