//
//  BranchLinkProperties+RNBranch.m
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Dispatcher. All rights reserved.
//

#import "BranchLinkProperties+RNBranch.h"
#import "RNBranchProperty.h"

@implementation BranchLinkProperties(RNBranch)

- (instancetype)initWithMap:(NSDictionary *)map
{
    self = [self init];
    if (self) {
        [RNBranchProperty setLinkPropertiesOn:self fromMap:map];
    }
    return self;
}

@end
