//
//  NavigationController.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import UIKit

/**
 * Custom UINavigationController to display an article list.
 */
class NavigationController: UINavigationController {
    override func viewDidLoad() {
        super.viewDidLoad()

        let font = UIFont(name: Style.boldFontName, size: Style.titleFontSize)
        let attributes: [ NSAttributedStringKey: Any ] = [ NSAttributedStringKey.font: font! ]
        navigationBar.titleTextAttributes = attributes

        setViewControllers([ArticleListViewController()], animated: false)
    }
}
