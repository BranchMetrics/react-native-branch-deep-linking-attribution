//
//  ViewController.m
//  testbed_native_ios
//
//  Created by Jimmy Dee on 3/22/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

#import <React/RCTRootView.h>

#import "ViewController.h"

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    // from dev server (simulator)
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios"];

    // from app bundle (device)
    // NSURL *jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    
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
