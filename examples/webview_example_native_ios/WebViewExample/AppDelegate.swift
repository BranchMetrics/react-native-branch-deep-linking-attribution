//
//  AppDelegate.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import UIKit
import Branch

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

        #if USE_BRANCH_TEST_INSTANCE
            Branch.setUseTestBranchKey(true)
        #endif
        Branch.getInstance()?.initSession(launchOptions: launchOptions) {
            branchUniversalObject, linkProperties, error in

            guard error == nil else {
                print("Error from Branch: \(error!)")
                return
            }

            guard let branchUniversalObject = branchUniversalObject else { return }

            self.routeURLFromBranch(branchUniversalObject: branchUniversalObject)
        }
        
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        return Branch.getInstance().application(app, open: url, options: options)
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        return Branch.getInstance().continue(userActivity)
    }

    // MARK: - Branch link routing

    @objc func routeURLFromBranch(branchUniversalObject: BranchUniversalObject) {
        guard let planetData = PlanetData(branchUniversalObject: branchUniversalObject) else { return }

        let articleViewController = ArticleViewController(planetData: planetData)
        navigationController.pushViewController(articleViewController, animated: true)
    }
}

