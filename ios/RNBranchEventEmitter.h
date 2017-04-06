//
//  RNBranchEventEmitter.h
//  Pods
//
//  Created by Jimmy Dee on 4/6/17.
//
//  Based on https://gist.github.com/andybangs/c4651a3916ebde0df1c977b220bbec4b

#import <React/RCTEventEmitter.h>
#import <React/RCTBridge.h>

@interface RNBranchEventEmitter : RCTEventEmitter<RCTBridgeModule>

+ (void)initSessionDidSucceedWithPayload:(NSDictionary *)payload;
+ (void)initSessionDidEncounterErrorWithPayload:(NSDictionary *)payload;

@end
