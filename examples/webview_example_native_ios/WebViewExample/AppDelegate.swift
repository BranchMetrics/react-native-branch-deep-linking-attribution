//
//  AppDelegate.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import UIKit
import react_native_branch

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var navigationController: NavigationController!

    // MARK: - UIApplicationDelegate methods

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        RCTLogInfo("application launched")

        // Store the NavigationController for later link routing.
        navigationController = window?.rootViewController as? NavigationController

        ReactBridge.start(launchOptions: launchOptions)

        // Initialize Branch SDK
        NotificationCenter.default.addObserver(self, selector: #selector(routeURLFromBranch), name: NSNotification.Name.RNBranchLinkOpened, object: nil)

        #if USE_BRANCH_TEST_INSTANCE
            RNBranch.useTestInstance()
        #endif
        RNBranch.initSession(launchOptions: launchOptions, isReferrable: true)
        
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        return RNBranch.branch.application(app, open: url, options: options)
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        return RNBranch.continue(userActivity)
    }

    // MARK: - Branch link routing

    @objc func routeURLFromBranch(_ notification: NSNotification) {
        guard let buo = notification.userInfo?[RNBranchLinkOpenedNotificationBranchUniversalObjectKey] as? BranchUniversalObject,
            let planetData = PlanetData(branchUniversalObject: buo) else { return }

        let articleViewController = ArticleViewController(planetData: planetData)
        navigationController.pushViewController(articleViewController, animated: true)
    }
}

