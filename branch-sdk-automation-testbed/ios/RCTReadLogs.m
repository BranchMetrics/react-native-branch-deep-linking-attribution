//
//  RCTReadLogs.m
//  branch_sdk_react_native_app
//
//  Created by Admin on 18/08/22.
//

#import <Foundation/Foundation.h>
// RCTCalendarModule.m
#import "RCTReadlogs.h"

@implementation RCTReadLogs

// To export a module named RCTReadlogs
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(clearLogs)
{
//   RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
       NSString *folderPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
       NSError *error = nil;
       for (NSString *file in [[NSFileManager defaultManager] contentsOfDirectoryAtPath:folderPath error:&error]) {
       [[NSFileManager defaultManager] removeItemAtPath:[folderPath stringByAppendingPathComponent:file] error:&error];
       }
}
RCT_EXPORT_METHOD(readLog:(RCTResponseSenderBlock)callback)
{
      
      NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
      NSString *documentsDirectory = [paths objectAtIndex:0];
      NSString *filePath = [documentsDirectory stringByAppendingPathComponent:@"console.log"];
      NSString *myString = [[NSString alloc] initWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:NULL];
      callback(@[myString]);
}
RCT_EXPORT_METHOD(createLogFile)
{
      NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
      NSString *documentsDirectory = [paths objectAtIndex:0];
      NSString *filePath = [documentsDirectory stringByAppendingPathComponent:@"console.log"];
      freopen([filePath cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);
}
@end
