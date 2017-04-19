//
//  BranchLinkPropertiesTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/18/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>

#import <react-native-branch/NSObject+RNBranch.h>
#import <react-native-branch/BranchLinkProperties+RNBranch.h>
#import <react-native-branch/RNBranchProperty.h>

@interface BranchLinkPropertiesTests : XCTestCase

@end

@implementation BranchLinkPropertiesTests

- (void)testFieldMapping
{
    NSDictionary<NSString *, RNBranchProperty *> *supportedProperties = BranchLinkProperties.supportedProperties;
    
    XCTAssertEqual(6, supportedProperties.count);
    
    XCTAssert([supportedProperties[@"alias"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setAlias:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"campaign"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setCampaign:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"channel"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setChannel:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"feature"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setFeature:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"stage"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setStage:) type:NSString.class]]);
    XCTAssert([supportedProperties[@"tags"] isEqual:
               [RNBranchProperty propertyWithSetterSelector:@selector(setTags:) type:NSArray.class]]);
}

@end
