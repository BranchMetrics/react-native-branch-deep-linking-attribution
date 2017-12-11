//
//  BranchUniversalObjectExtensionTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/18/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/NSObject+RNBranch.h>
#import <react-native-branch/BranchUniversalObject+RNBranch.h>
#import <react-native-branch/RNBranchProperty.h>

@interface BranchUniversalObjectExtensionTests : XCTestCase

@end

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

@implementation BranchUniversalObjectExtensionTests

#pragma mark - General tests

- (void)testFieldMapping
{
    NSDictionary<NSString *, RNBranchProperty *> *supportedProperties = BranchUniversalObject.supportedProperties;
    
    XCTAssertEqual(15, supportedProperties.count);

    XCTAssert([supportedProperties[@"automaticallyListOnSpotlight"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setAutomaticallyListOnSpotlightWithNumber:) type:NSNumber.class]]);
    XCTAssert([supportedProperties[@"canonicalUrl"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setCanonicalUrl:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"contentDescription"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setContentDescription:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"contentImageUrl"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setImageUrl:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"contentIndexingMode"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setContentIndexingMode:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"currency"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setCurrency:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"expirationDate"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setExpirationDateWithString:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"keywords"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setKeywords:) type:NSArray.class]]);
    XCTAssert([supportedProperties[@"metadata"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setMetadata:) type:NSDictionary.class]]);
    XCTAssert([supportedProperties[@"price"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setPriceWithNumber:) type:NSNumber.class]]);
    XCTAssert([supportedProperties[@"title"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setTitle:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"type"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setType:) type:NSString.class]]);
}

- (void)testInitialization
{
    NSString *expirationDate = @"2018-04-18T00:00:00";
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] initWithMap:@{ @"canonicalIdentifier": @"abc",
                                                                               @"automaticallyListOnSpotlight": @(YES),
                                                                               @"canonicalUrl": @"canonicalUrl",
                                                                               @"contentDescription": @"contentDescription",
                                                                               @"contentImageUrl": @"contentImageUrl",
                                                                               @"contentIndexingMode": @"public",
                                                                               @"currency": @"currency",
                                                                               @"expirationDate": expirationDate,
                                                                               @"keywords": @[@"keyword1", @"keyword2"],
                                                                               @"metadata": @{@"key1": @"value1", @"key2": @"value2"},
                                                                               @"title": @"title",
                                                                               @"type": @"type"
                                                                               }];

    struct tm expiration;
    strptime(expirationDate.UTF8String, "%Y-%m-%dT%H:%M:%S", &expiration);
    NSTimeInterval expectedExpiration = timegm(&expiration);

    XCTAssertEqualObjects(@"abc", buo.canonicalIdentifier);
    XCTAssert(buo.automaticallyListOnSpotlight);
    XCTAssertEqualObjects(@"canonicalUrl", buo.canonicalUrl);
    XCTAssertEqualObjects(@"contentDescription", buo.contentDescription);
    XCTAssertEqualObjects(@"contentImageUrl", buo.imageUrl);
    XCTAssertEqual(BranchContentIndexModePublic, buo.contentIndexMode);
    XCTAssertEqualObjects(@"currency", buo.currency);
    XCTAssertEqual(expectedExpiration, buo.expirationDate.timeIntervalSince1970);

    XCTAssertEqual(2, buo.keywords.count);
    XCTAssertEqualObjects(@"keyword1", buo.keywords[0]);
    XCTAssertEqualObjects(@"keyword2", buo.keywords[1]);

    XCTAssertEqual(2, buo.metadata.allKeys.count);
    XCTAssertEqualObjects(@"value1", buo.metadata[@"key1"]);
    XCTAssertEqualObjects(@"value2", buo.metadata[@"key2"]);

    XCTAssertEqualObjects(@"title", buo.title);
    XCTAssertEqualObjects(@"type", buo.type);
}

#pragma mark - Content indexing mode

- (void)testPublicContentIndexingMode
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    [buo setContentIndexingMode:@"public"];
    XCTAssertEqual(BranchContentIndexModePublic, buo.contentIndexMode);
}

- (void)testPrivateContentIndexingMode
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    [buo setContentIndexingMode:@"private"];
    XCTAssertEqual(BranchContentIndexModePrivate, buo.contentIndexMode);
}

#pragma mark - Automatically list on spotlight

- (void)testAutomaticallyListOnSpotlightYes
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    [buo setAutomaticallyListOnSpotlightWithNumber:@(YES)];
    XCTAssert(buo.automaticallyListOnSpotlight);
}

- (void)testAutomaticallyListOnSpotlightNo
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    [buo setAutomaticallyListOnSpotlightWithNumber:@(NO)];
    XCTAssertFalse(buo.automaticallyListOnSpotlight);
}

#pragma mark - Expiration date

- (void)testExpirationDate
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    NSString *expirationDate = @"2018-04-18T00:00:00";
    [buo setExpirationDateWithString:expirationDate];
    
    struct tm expiration;
    strptime(expirationDate.UTF8String, "%Y-%m-%dT%H:%M:%S", &expiration);
    NSTimeInterval expected = timegm(&expiration);

    XCTAssertEqual(expected, buo.expirationDate.timeIntervalSince1970);
}

#pragma mark - Price

- (void)testPrice
{
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] init];
    [buo setPriceWithNumber:@(1.0)];
    XCTAssertEqual(1.0, buo.price);
}

@end

#pragma clang diagnostic pop
