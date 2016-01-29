//
//  RNBranch.h
//  RNBranch
//
//  Created by Kevin Stumpf on 1/28/16.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface RNBranch : NSObject <RCTBridgeModule>

+ (void)initSessionWithLaunchOptionsFinished:(NSDictionary*)params withError:(NSError*)error;

@end