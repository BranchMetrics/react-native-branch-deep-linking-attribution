//
//  RNBranchConfig.h
//  Pods
//
//  Created by Jimmy Dee on 6/7/17.
//
//

#import <Foundation/Foundation.h>

extern NSString * _Nonnull const RNBranchConfigDebugModeOption;
extern NSString * _Nonnull const RNBranchConfigLiveKeyOption;
extern NSString * _Nonnull const RNBranchConfigTestKeyOption;
extern NSString * _Nonnull const RNBranchConfigUseTestInstanceOption;
extern NSString * _Nonnull const RNBranchConfigDelayInitToCheckForSearchAdsOption;

@interface RNBranchConfig : NSObject

@property (class, readonly, nonnull) RNBranchConfig *instance;
@property (nonatomic, readonly, nullable) NSURL *configFileURL;
@property (nonatomic, readonly) BOOL debugMode;
@property (nonatomic, readonly, nullable) NSString *liveKey;
@property (nonatomic, readonly, nullable) NSString *testKey;
@property (nonatomic, readonly) BOOL useTestInstance;
@property (nonatomic, readonly) BOOL delayInitToCheckForSearchAds;

- (nullable id)objectForKey:(NSString * _Nonnull)key;
- (nullable id)objectForKeyedSubscript:(NSString * _Nonnull)key;

@end
