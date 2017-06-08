//
//  RNBranchConfig.m
//  Pods
//
//  Created by Jimmy Dee on 6/7/17.
//
//

#import <React/RCTLog.h>

#import "RNBranchConfig.h"

NSString * _Nonnull const RNBranchConfigDebugModeOption = @"debugMode";
NSString * _Nonnull const RNBranchConfigLiveKeyOption = @"liveKey";
NSString * _Nonnull const RNBranchConfigTestKeyOption = @"testKey";
NSString * _Nonnull const RNBranchConfigUseTestInstanceOption = @"useTestInstance";

@interface RNBranchConfig()
@property (nonatomic) NSDictionary *configuration;
@end

@implementation RNBranchConfig

+ (RNBranchConfig * _Nonnull)instance
{
    static RNBranchConfig *_instance;
    static dispatch_once_t once = 0;
    dispatch_once(&once, ^{
        _instance = [[RNBranchConfig alloc] init];
    });
    return _instance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self loadConfigFile];
    }
    return self;
}

- (void)loadConfigFile
{
    NSURL *configFileURL = [[NSBundle mainBundle] URLForResource:@"branch" withExtension:@"json"];
    if (!configFileURL) {
        RCTLog(@"Could not find branch.json in app bundle.");
        return;
    }

    NSError *error;
    NSData *data = [NSData dataWithContentsOfURL:configFileURL options:0 error:&error];
    if (!data || error) {
        RCTLogError(@"Failed to load branch.json. Error: %@", error.localizedDescription);
        return;
    }

    id object = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (!object || error) {
        RCTLogError(@"Failed to parse branch.json. Error: %@", error.localizedDescription);
        return;
    }

    if (![object isKindOfClass:NSDictionary.class]) {
        RCTLogError(@"Contents of branch.json should be a JSON object.");
        return;
    }

    self.configuration = object;
}

- (BOOL)debugMode
{
    NSNumber *number = self[RNBranchConfigDebugModeOption];
    return number.boolValue;
}

- (BOOL)useTestInstance
{
    NSNumber *number = self[RNBranchConfigUseTestInstanceOption];
    return number.boolValue;
}

- (NSString *)liveKey
{
    return self[RNBranchConfigLiveKeyOption];
}

- (NSString *)testKey
{
    return self[RNBranchConfigTestKeyOption];
}

- (id)objectForKey:(NSString *)key
{
    return self.configuration[key];
}

- (id)objectForKeyedSubscript:(NSString *)key
{
    return self.configuration[key];
}

@end
