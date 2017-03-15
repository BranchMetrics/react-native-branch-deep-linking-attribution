//
//  BranchUniversalObject+RNBranch.h
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <Branch/Branch.h>

@class RNBranchProperty;

@interface BranchUniversalObject(RNBranch)

- (void)setContentIndexingMode:(NSString *)contentIndexingMode;

- (instancetype)initWithMap:(NSDictionary *)map;

- (void)rnbranchUserCompletedAction:(NSString *)action withState:(NSDictionary *)state;

@end
