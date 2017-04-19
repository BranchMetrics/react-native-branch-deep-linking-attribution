//
//  RNBranchPropertyTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/18/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/RNBranchProperty.h>

@interface RNBranchPropertyTests : XCTestCase

@end

@implementation RNBranchPropertyTests

- (void)testInitialization
{
    RNBranchProperty *propertyA = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSURL.class];

    XCTAssertEqual(NSURL.class, propertyA.type);
    XCTAssertEqual(@selector(setURL:), propertyA.setterSelector);
}

- (void)testEquality
{
    RNBranchProperty *propertyA = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSURL.class];
    RNBranchProperty *propertyB = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSURL.class];
    
    // This method was mainly introduced to simplify other tests.
    XCTAssert([propertyA isEqual:propertyB]);
}

- (void)testSelectorInequality
{
    RNBranchProperty *propertyA = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSURL.class];
    RNBranchProperty *propertyB = [RNBranchProperty propertyWithSetterSelector:@selector(setContentDescription:) type:NSURL.class];
    
    XCTAssertFalse([propertyA isEqual:propertyB]);
}

- (void)testTypeInequality
{
    RNBranchProperty *propertyA = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSURL.class];
    RNBranchProperty *propertyB = [RNBranchProperty propertyWithSetterSelector:@selector(setURL:) type:NSString.class];
    
    XCTAssertFalse([propertyA isEqual:propertyB]);
}

@end
