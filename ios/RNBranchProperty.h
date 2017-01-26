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
@property (nonatomic) SEL setterSelector;
@property (nonatomic) Class type;

+ (instancetype) propertyWithSetterSelector:(SEL)selector type:(Class)type;

- (instancetype) initWithSetterSelector:(SEL)selector type:(Class)type NS_DESIGNATED_INITIALIZER;
@end
