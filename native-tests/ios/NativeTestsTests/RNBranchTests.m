//
//  RNBranchTests.m
//  NativeTests
//
//  Created by Jimmy Dee on 4/21/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <XCTest/XCTest.h>
#import <react-native-branch/RNBranch.h>
#import <react-native-branch/RNBranchEventEmitter.h>
#import <Branch/Branch.h>

@interface RNBranchTests : XCTestCase
@property (nonatomic) RNBranch *rnbranch;
@end

@implementation RNBranchTests

- (void)setUp {
    [super setUp];
    self.rnbranch = [[RNBranch alloc] init];
}

#pragma mark - Exported constants

- (void)testInitSessionSuccessConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"INIT_SESSION_SUCCESS"];
    XCTAssertEqual(kRNBranchInitSessionSuccess, constant);
}

- (void)testInitSessionErrorConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"INIT_SESSION_ERROR"];
    XCTAssertEqual(kRNBranchInitSessionError, constant);
}

- (void)testAddToCartEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"ADD_TO_CART_EVENT"];
    XCTAssertEqual(BNCAddToCartEvent, constant);
}

- (void)testAddToWishlistEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"ADD_TO_WISHLIST_EVENT"];
    XCTAssertEqual(BNCAddToWishlistEvent, constant);
}

- (void)testPurchasedEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"PURCHASED_EVENT"];
    XCTAssertEqual(BNCPurchasedEvent, constant);
}

- (void)testPurchaseInitiatedEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"PURCHASE_INITIATED_EVENT"];
    XCTAssertEqual(BNCPurchaseInitiatedEvent, constant);
}

- (void)testRegisterViewEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"REGISTER_VIEW_EVENT"];
    XCTAssertEqual(BNCRegisterViewEvent, constant);
}

- (void)testShareCompletedEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"SHARE_COMPLETED_EVENT"];
    XCTAssertEqual(BNCShareCompletedEvent, constant);
}

- (void)testShareInitiatedEventConstant
{
    NSString *constant = self.rnbranch.constantsToExport[@"SHARE_INITIATED_EVENT"];
    XCTAssertEqual(BNCShareInitiatedEvent, constant);
}

@end
