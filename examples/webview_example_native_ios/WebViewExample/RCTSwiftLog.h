//
//  RCTLogWrapper.h
//  
//
//  Created by Jimmy Dee on 4/5/17.
//
//

#import <Foundation/Foundation.h>

@interface RCTSwiftLog : NSObject

+ (void)error:(NSString * _Nonnull)message;
+ (void)warn:(NSString * _Nonnull)message;
+ (void)info:(NSString * _Nonnull)message;
+ (void)log:(NSString * _Nonnull)message;
+ (void)trace:(NSString * _Nonnull)message;

@end
