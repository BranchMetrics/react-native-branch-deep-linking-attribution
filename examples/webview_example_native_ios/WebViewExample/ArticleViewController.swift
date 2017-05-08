//
//  ArticleViewController.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import React
import UIKit

/**
 * Displays an ArticleView for the specified PlanetData and provides
 * the ArticleViewDelegate for the ArticleView.
 */
class ArticleViewController: UIViewController {

    // MARK: - Stored properties

    let planetData: PlanetData
    var rootView: RCTRootView!

    // MARK: - Object lifecycle

    init(planetData: PlanetData) {
        self.planetData = planetData
        super.init(nibName: nil, bundle: nil)
        title = planetData.title
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // MARK: - View lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        
        guard let bridge = ReactBridge.shared,
            let rootView = RCTRootView(bridge: bridge, moduleName: "webview_example_native_ios", initialProperties: planetData.reactNativeRoute)
            else {
                RCTLogError("Failed to create RCTRootView")
                return
        }

        self.rootView = rootView

        RCTLog("rootView.appProperties = \(rootView.appProperties ?? [:])")

        view.addSubview(rootView)
        rootView.translatesAutoresizingMaskIntoConstraints = false

        view.addConstraint(view.centerXAnchor.constraint(equalTo: rootView.centerXAnchor))
        view.addConstraint(view.centerYAnchor.constraint(equalTo: rootView.centerYAnchor))
        view.addConstraint(view.widthAnchor.constraint(equalTo: rootView.widthAnchor))
        view.addConstraint(view.heightAnchor.constraint(equalTo: rootView.heightAnchor))

        assert(self.rootView != nil)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        RCTLog("viewWillAppear:")

        RCTLog("rootView.appProperties = \(rootView.appProperties)")
    }
}
