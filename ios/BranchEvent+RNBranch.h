//
//  BranchEvent+RNBranch.h
//  Branch-SDK
//
//  Created by Jimmy Dee on 11/28/17.
//

#import <Branch/Branch.h>

@interface BranchEvent(RNBranch)

- (instancetype)initWithName:(NSString *)eventName map:(NSDictionary *)map;

@end
