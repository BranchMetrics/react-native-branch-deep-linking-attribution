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

- (void)testTtlInitialization {
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];

    // ttl property returns the constructor argument.
    XCTAssertEqual(3600.0, dictionary.ttl);
}

- (void)testValueIsNullWhenKeyNotFound
{
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];

    // key access returns nil when the key is not present.
    XCTAssertNil(dictionary[@"key"]);
    XCTAssertNil([dictionary objectForKey:@"key"]);
}

- (void)testInsertionAndRetrieval
{
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];

    NSString *value1 = @"value1", *value2 = @"value2";
    dictionary[@"key1"] = value1;
    [dictionary setObject:value2 forKey:@"key2"];

    // access returns a value if the key is present and has not expired.
    XCTAssertEqual(value1, dictionary[@"key1"]);
    XCTAssertEqual(value1, [dictionary objectForKey:@"key1"]);

    XCTAssertEqual(value2, dictionary[@"key2"]);
    XCTAssertEqual(value2, [dictionary objectForKey:@"key2"]);
}

- (void)testRemoval
{
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:3600.0];

    dictionary[@"key"] = @"value";
    [dictionary removeObjectForKey:@"key"];

    // access returns nil after a key is removed.
    XCTAssertNil(dictionary[@"key"]);
}

- (void)testExpiration
{
    RNBranchAgingDictionary *dictionary = [RNBranchAgingDictionary dictionaryWithTtl:1e-3]; // 1 ms TTL

    dictionary[@"key1"] = @"value1";

    usleep(10000); // sleep for 10 ms

    dictionary[@"key2"] = @"value2";

    // Deletes expired keys on insertion
    XCTAssertNil(dictionary[@"key1"]);
}

@end
