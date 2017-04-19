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

@implementation BranchUniversalObjectExtensionTests

- (void)testFieldMapping
{
    NSDictionary<NSString *, RNBranchProperty *> *supportedProperties = BranchUniversalObject.supportedProperties;
    
    XCTAssertEqual(12, supportedProperties.count);

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
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
#pragma clang diagnostic pop
}

@end
