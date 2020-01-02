//
//  NSURLSession+Branch.m
//  BranchSearchDemo
//
//  Created by Ernest Cho on 10/11/18.
//  Copyright © 2018 Branch Metrics, Inc. All rights reserved.
//

#import <React/RCTLog.h>
#import "NSURLSession+Branch.h"
#import <objc/runtime.h>

//  Logs EVERY network request!  Only include this file to debug the project at a low level.
//  This should NOT be included in any target by default.
@implementation NSURLSession (Branch)

// load is called when a class or category is loaded into the ObjC runtime
+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self swizzleSelector:@selector(dataTaskWithRequest:completionHandler:)
                 withSelector:@selector(xxx_dataTaskWithRequest:completionHandler:)];
        
        [self swizzleSelector:@selector(downloadTaskWithRequest:completionHandler:)
                 withSelector:@selector(xxx_downloadTaskWithRequest:completionHandler:)];
    });
}

// swaps originalSelector with swizzledSelector
+ (void)swizzleSelector:(SEL)originalSelector withSelector:(SEL)swizzledSelector {
    Class class = [self class];
    
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    method_exchangeImplementations(originalMethod, swizzledMethod);
}

// replacement method for dataTaskWithRequest
- (NSURLSessionDataTask *)xxx_dataTaskWithRequest:(NSURLRequest *)request
                                completionHandler:(void (^)(NSData *data, NSURLResponse *response, NSError *error))completionHandler {
    
    // create a new block that just calls the original block after logging the request
    void (^completionHandlerWithLogging)(NSData *, NSURLResponse *, NSError *) = ^(NSData *data, NSURLResponse *response, NSError *error) {
        if (completionHandler) {
            RCTLog(@"NSURLSessionDataTask Request: %@", request);
            
            NSData *body = [request HTTPBody];
            if (body) {
                RCTLog(@"NSURLSessionDataTask Request Body: %@", [NSString stringWithUTF8String:body.bytes]);
            }
            
            RCTLog(@"NSURLSessionDataTask Response: %@", response);
            if (data.bytes) {
                RCTLog(@"NSURLSessionDataTask Response Data: %@", [NSString stringWithUTF8String:data.bytes]);
            }
            
            completionHandler(data, response, error);
        }
    };
    
    // Since swizzleSelector swaps the names of the two methods, this is the xxx_dataTaskWithRequest version.
    return [self xxx_dataTaskWithRequest:request completionHandler:completionHandlerWithLogging];
}

// replacement method for downloadTaskWithRequest
- (NSURLSessionDownloadTask *)xxx_downloadTaskWithRequest:(NSURLRequest *)request
                                        completionHandler:(void (^)(NSURL *location, NSURLResponse *response, NSError *error))completionHandler {
    
    // create a new block that just calls the original block after logging the request
    void (^completionHandlerWithLogging)(NSURL *location, NSURLResponse *response, NSError *error) = ^(NSURL *location, NSURLResponse *response, NSError *error) {
        if (completionHandler) {
            RCTLog(@"NSURLSessionDownloadTask Request: %@", request);
            RCTLog(@"NSURLSessionDownloadTask Response: %@", response);
            
            completionHandler(location, response, error);
        }
    };
    
    // Since swizzleSelector swaps the names of the two methods, this is the xxx_downloadTaskWithRequest version.
    return [self xxx_downloadTaskWithRequest:request completionHandler:completionHandlerWithLogging];
}

@end
