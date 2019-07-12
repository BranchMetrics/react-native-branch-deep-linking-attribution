//
//  ViewController.m
//  testbed_native_ios
//
//  Created by Jimmy Dee on 3/22/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "ViewController.h"

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    
    RCTRootView *rootView =
    [[RCTRootView alloc] initWithBundleURL : jsCodeLocation
                         moduleName        : @"testbed_native_ios"
                         initialProperties : @{}
                          launchOptions    : nil];
    
    [self.view addSubview:rootView];

    // Add constraints to fill the parent view
    rootView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addConstraint: [rootView.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor]];
    [self.view addConstraint: [rootView.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor]];
    [self.view addConstraint: [rootView.widthAnchor constraintEqualToAnchor:self.view.widthAnchor]];
    [self.view addConstraint: [rootView.heightAnchor constraintEqualToAnchor:self.view.heightAnchor]];
}

@end
