//
//  RNBranchAgingItemTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/24/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/RNBranchAgingItem.h>

@interface RNBranchAgingItemTests : XCTestCase

@end

@implementation RNBranchAgingItemTests

- (void)testInitialization
{
    NSString *expected = @"abc";
    NSTimeInterval beforeInitialization = [NSDate date].timeIntervalSince1970;
    RNBranchAgingItem *item = [[RNBranchAgingItem alloc] initWithItem:expected];
    NSTimeInterval afterInitialization = [NSDate date].timeIntervalSince1970;

    // Access time initialized to initialization time.
    XCTAssertGreaterThanOrEqual(item.accessTime, beforeInitialization);
    XCTAssertLessThanOrEqual(item.accessTime, afterInitialization);

    // item property returns the constructor argument.
    XCTAssertEqual(expected, item.item);
}

- (void)testAccessTime
{
    NSString *expected = @"abc";
    RNBranchAgingItem *item = [[RNBranchAgingItem alloc] initWithItem:expected];
    NSTimeInterval afterInitialization = [NSDate date].timeIntervalSince1970;

    usleep(10000); // sleep for 10 ms

    NSString *value = item.item;
    NSTimeInterval afterAccess = [NSDate date].timeIntervalSince1970;

    // Access time updated after calling [item item].
    XCTAssertGreaterThanOrEqual(item.accessTime, afterInitialization);
    XCTAssertLessThanOrEqual(item.accessTime, afterAccess);

    // Avoid a complaint about an unused variable.
    XCTAssertEqual(expected, value);
}

@end
