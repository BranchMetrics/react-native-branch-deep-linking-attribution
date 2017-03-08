//
//  RNBranchAgingItem.h
//  RNBranch
//
//  Created by Jimmy Dee on 3/8/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RNBranchAgingItem : NSObject

@property (nonatomic, readonly) id item;
@property (nonatomic, readonly) NSTimeInterval accessTime;

- (instancetype) initWithItem:(id)item NS_DESIGNATED_INITIALIZER;

@end
