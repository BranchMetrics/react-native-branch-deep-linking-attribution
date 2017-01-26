//
//  RNBranchProperty.h
//  RNBranch
//
//  Created by Jimmy Dee on 1/26/17.
//  Copyright © 2017 Dispatcher. All rights reserved.
//

#import <Branch/Branch.h>

/*
 * Utility class to represent dynamically all supported JS properties on BranchUniversalObject and BranchLinkProperties.
 */
@interface RNBranchProperty : NSObject
+ (void)setLinkPropertiesOn:(BranchLinkProperties *)linkProperties fromMap:(NSDictionary *)map;
+ (void)setUniversalObjectPropertiesOn:(BranchUniversalObject *)universalObject fromMap:(NSDictionary *)map;
@end
