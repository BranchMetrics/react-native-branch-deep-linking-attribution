//
//  ArticleViewController.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import UIKit

/**
 * Displays an ArticleView for the specified PlanetData and provides
 * the ArticleViewDelegate for the ArticleView.
 */
class ArticleViewController: UIViewController {

    // MARK: - Stored properties

    let planetData: PlanetData

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
    }
}
