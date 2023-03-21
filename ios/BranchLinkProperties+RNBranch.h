//
//  BranchLinkProperties+RNBranch.h
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <BranchSDK/Branch.h>
#import <BranchSDK/BranchLinkProperties.h>
@class RNBranchProperty;

@interface BranchLinkProperties(RNBranch)

- (instancetype)initWithMap:(NSDictionary *)map;

@end
