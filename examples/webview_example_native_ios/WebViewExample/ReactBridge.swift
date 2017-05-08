//
//  ReactBridge.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 4/5/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import React
import UIKit

struct ReactBridge {
    static func start(launchOptions: [UIApplicationLaunchOptionsKey: Any]?) {
        guard let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.ios", fallbackResource: nil) else {
            RCTLogError("Failed to get JS code location")
            return
        }
        shared = RCTBridge(bundleURL: jsCodeLocation, moduleProvider: nil, launchOptions: launchOptions)
    }

    static var shared: RCTBridge!
}
