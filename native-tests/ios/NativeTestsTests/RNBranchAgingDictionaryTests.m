//
//  RNBranchAgingDictionaryTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/13/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/RNBranchAgingDictionary.h>

@interface RNBranchAgingDictionaryTests : XCTestCase
@end

@implementation RNBranchAgingDictionaryTests

- (void)testTtl {
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];
    XCTAssertEqual(3600.0, dictionary.ttl);
}

@end
