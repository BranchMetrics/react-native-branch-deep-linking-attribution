//
//  RNBranchConfig.h
//  Pods
//
//  Created by Jimmy Dee on 6/7/17.
//
//

#import <Foundation/Foundation.h>

extern NSString * _Nonnull const RNBranchConfigDebugModeOption;

@interface RNBranchConfig : NSObject

@property (nonatomic, readonly) BOOL debugMode;

- (nullable id)objectForKey:(NSString * _Nonnull)key;
- (nullable id)objectForKeyedSubscript:(NSString * _Nonnull)key;

+ (RNBranchConfig * _Nonnull)instance;

@end
