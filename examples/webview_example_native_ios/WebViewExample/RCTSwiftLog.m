//
//  RCTLogWrapper.m
//  
//
//  Created by Jimmy Dee on 4/5/17.
//
//

#import <React/RCTLog.h>

#import "RCTSwiftLog.h"

@implementation RCTSwiftLog

+ (void)info:(NSString *)message
{
    RCTLogInfo(@"%@", message);
}

+ (void)warn:(NSString *)message
{
    RCTLogWarn(@"%@", message);
}

+ (void)error:(NSString *)message
{
    RCTLogError(@"%@", message);
}

+ (void)log:(NSString *)message
{
    RCTLog(@"%@", message);
}

+ (void)trace:(NSString *)message
{
    RCTLogTrace(@"%@", message);
}

@end
