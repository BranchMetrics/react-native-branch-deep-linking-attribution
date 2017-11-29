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

#define ASSERT_CONSTANT(constantName, expectedValue) \
    NSString *constant = self.rnbranch.constantsToExport[constantName]; \
    XCTAssertEqualObjects(expectedValue, constant);

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
    ASSERT_CONSTANT(@"INIT_SESSION_SUCCESS", kRNBranchInitSessionSuccess);
}

- (void)testInitSessionErrorConstant
{
    ASSERT_CONSTANT(@"INIT_SESSION_ERROR", kRNBranchInitSessionError);
}

- (void)testAddToCartEventConstant
{
    ASSERT_CONSTANT(@"ADD_TO_CART_EVENT", BNCAddToCartEvent);
}

- (void)testAddToWishlistEventConstant
{
    ASSERT_CONSTANT(@"ADD_TO_WISHLIST_EVENT", BNCAddToWishlistEvent);
}

- (void)testPurchasedEventConstant
{
    ASSERT_CONSTANT(@"PURCHASED_EVENT", BNCPurchasedEvent);
}

- (void)testPurchaseInitiatedEventConstant
{
    ASSERT_CONSTANT(@"PURCHASE_INITIATED_EVENT", BNCPurchaseInitiatedEvent);
}

- (void)testRegisterViewEventConstant
{
    ASSERT_CONSTANT(@"REGISTER_VIEW_EVENT", BNCRegisterViewEvent);
}

- (void)testShareCompletedEventConstant
{
    ASSERT_CONSTANT(@"SHARE_COMPLETED_EVENT", BNCShareCompletedEvent);
}

- (void)testShareInitiatedEventConstant
{
    ASSERT_CONSTANT(@"SHARE_INITIATED_EVENT", BNCShareInitiatedEvent);
}

- (void)testStandardAddtoCartEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_ADD_TO_CART", BranchStandardEventAddToCart);
}

- (void)testStandardAddtoWishlistEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_ADD_TO_WISHLIST", BranchStandardEventAddToWishlist);
}

- (void)testStandardViewCartEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_VIEW_CART", BranchStandardEventViewCart);
}

- (void)testStandardInitiatePurchaseEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_INITIATE_PURCHASE", BranchStandardEventInitiatePurchase);
}

- (void)testStandardAddPaymentInfoEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_ADD_PAYMENT_INFO", BranchStandardEventAddPaymentInfo);
}

- (void)testStandardPurchaseEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_PURCHASE", BranchStandardEventPurchase);
}

- (void)testStandardSpendCreditsEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_SPEND_CREDITS", BranchStandardEventSpendCredits);
}

- (void)testStandardSearchEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_SEARCH", BranchStandardEventSearch);
}

- (void)testStandardViewItemEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_VIEW_ITEM", BranchStandardEventViewItem);
}

- (void)testStandardViewItemsEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_VIEW_ITEMS", BranchStandardEventViewItems);
}

- (void)testStandardRateEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_RATE", BranchStandardEventRate);
}

- (void)testStandardRateEventShareConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_SHARE", BranchStandardEventShare);
}

- (void)testStandardCompleteRegistrationEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_COMPLETE_REGISTRATION", BranchStandardEventCompleteRegistration);
}

- (void)testStandardCompleteTutorialEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_COMPLETE_TUTORIAL", BranchStandardEventCompleteTutorial);
}

- (void)testStandardAchieveLevelEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_ACHIEVE_LEVEL", BranchStandardEventAchieveLevel);
}

- (void)testStandardUnlockAchievementEventConstant
{
    ASSERT_CONSTANT(@"STANDARD_EVENT_UNLOCK_ACHIEVEMENT", BranchStandardEventUnlockAchievement);
}

@end
