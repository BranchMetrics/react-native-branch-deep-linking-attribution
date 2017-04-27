//
//  NSObjectExtensionTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/18/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/NSObject+RNBranch.h>
#import <react-native-branch/RNBranchProperty.h>

@interface TestClass: NSObject
@property (nonatomic, copy) NSString *foo;
@end

@implementation TestClass

+ (NSDictionary<NSString *,RNBranchProperty *> *)supportedProperties
{
    return @{ @"foo": [RNBranchProperty propertyWithSetterSelector:@selector(setFoo:) type:NSString.class] };
}

@end

@interface NSObjectExtensionTests : XCTestCase
@property (nonatomic) TestClass *testClass;
@end

@implementation NSObjectExtensionTests

- (void)setUp
{
    [super setUp];
    self.testClass = [[TestClass alloc] init];
}

- (void)testSupportedProperties
{
    [self.testClass setSupportedPropertiesWithMap:@{ @"foo": @"bar" }];

    XCTAssertEqualObjects(@"bar", self.testClass.foo);
}

- (void)testUnsupportedProperty
{
    [self.testClass setSupportedPropertiesWithMap:@{ @"badKey": @"badKeyValue" }];

    // Also logs a diagnostic about an unsupported property. Does not modify the receiver.
    XCTAssertNil(self.testClass.foo);
}

- (void)testWrongValue
{
    [self.testClass setSupportedPropertiesWithMap:@{ @"foo": @(1) }];

    // Also logs a diagnostic about a bad type. Does not modify the receiver.
    XCTAssertNil(self.testClass.foo);
}

@end
