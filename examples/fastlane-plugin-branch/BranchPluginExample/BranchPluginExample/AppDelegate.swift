//
//  AppDelegate.swift
//  BranchPluginExample
//
//  Created by Jimmy Dee on 4/14/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import Branch
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    #if DEBUG
        let branch = Branch.getTestInstance()
    #else
        let branch = Branch.getInstance()
    #endif

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        branch?.initSession(launchOptions: launchOptions) {
            (branchUniversalObject: BranchUniversalObject?, linkProperties: BranchLinkProperties?, error: Error?) in
            guard error == nil else {
                print("Error from Branch: \(error!)")
                return
            }

            print("Opened link for BUO with canonicalIdentifier = \(branchUniversalObject?.canonicalIdentifier ?? "(nil)")")
        }

        return true
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
        return branch?.continue(userActivity) ?? false
    }
}

