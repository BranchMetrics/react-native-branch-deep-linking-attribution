//
//  BranchEventExtensionTests.m
//  NativeTestsTests
//
//  Created by Jimmy Dee on 12/1/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/NSObject+RNBranch.h>
#import <react-native-branch/BranchEvent+RNBranch.h>
#import <react-native-branch/RNBranchProperty.h>

@interface BranchEventExtensionTests : XCTestCase

@end

@implementation BranchEventExtensionTests

- (void)testFieldMapping
{
    NSDictionary<NSString *, RNBranchProperty *> *supportedProperties = BranchEvent.supportedProperties;
    XCTAssertEqual(10, supportedProperties.count);

    XCTAssert([supportedProperties[@"transactionID"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setTransactionID:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"currency"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setCurrency:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"revenue"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setRevenueWithString:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"shipping"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setShippingWithString:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"tax"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setTaxWithString:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"coupon"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setCoupon:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"affiliation"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setAffiliation:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"description"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setEventDescription:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"searchQuery"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setSearchQuery:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"customData"] isEqual:[RNBranchProperty propertyWithSetterSelector:@selector(setCustomData:) type:NSDictionary.class]]);
}

- (void)testInitialization
{
    BranchEvent *event = [[BranchEvent alloc] initWithName:BranchStandardEventViewItem
                                                       map:@{
                                                             @"transactionID": @"transactionID",
                                                             @"currency": BNCCurrencyUSD,
                                                             @"revenue": @"20.00",
                                                             @"shipping": @"2.00",
                                                             @"tax": @"1.60",
                                                             @"coupon": @"coupon code",
                                                             @"affiliation": @"affiliation",
                                                             @"description": @"description",
                                                             @"searchQuery": @"searchQuery",
                                                             @"customData": @{ @"key": @"value" }
                                                            }];

    XCTAssertEqualObjects(@"transactionID", event.transactionID);
    XCTAssertEqualObjects(BNCCurrencyUSD, event.currency);
    XCTAssertEqualObjects([NSDecimalNumber decimalNumberWithString:@"20.00"], event.revenue);
    XCTAssertEqualObjects([NSDecimalNumber decimalNumberWithString:@"2.00"], event.shipping);
    XCTAssertEqualObjects([NSDecimalNumber decimalNumberWithString:@"1.60"], event.tax);
    XCTAssertEqualObjects(@"coupon code", event.coupon);
    XCTAssertEqualObjects(@"affiliation", event.affiliation);
    XCTAssertEqualObjects(@"description", event.eventDescription);
    XCTAssertEqualObjects(@"searchQuery", event.searchQuery);
    XCTAssertEqualObjects(@{ @"key": @"value" }, event.customData);
}

@end
