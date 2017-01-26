//
//  BranchUniversalObject+RNBranch.h
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Dispatcher. All rights reserved.
//

#import <Branch/Branch.h>

@interface BranchUniversalObject(RNBranch)

- (void)setContentIndexingMode:(NSString *)contentIndexingMode;

- (instancetype)initWithMap:(NSDictionary *)map;

@end
