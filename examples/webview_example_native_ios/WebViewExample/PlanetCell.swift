//
//  PlanetCell.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 3/29/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

import UIKit

/**
 * Displays the `UIImage(named: planetData.title)` in a UIImageView at the left and
 * `planetData.title` in a label to the right.
 */
class PlanetCell: UITableViewCell {
    /// UITableViewCell reuseIdentifier for this class
    static let identifier = "Planet"

    // MARK: - Stored properties

    var planetData: PlanetData? {
        didSet {
            updatePlanetData()
        }
    }

    let thumbnailImageView = UIImageView()
    let label = UILabel()

    // MARK: - Object lifecycle

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        contentView.addSubview(thumbnailImageView)
        contentView.addSubview(label)

        setupConstraints()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // MARK: - Private methods

    private func setupConstraints() {
        let margin: CGFloat = 20

        contentView.translatesAutoresizingMaskIntoConstraints = false
        thumbnailImageView.translatesAutoresizingMaskIntoConstraints = false
        label.translatesAutoresizingMaskIntoConstraints = false

        /*
         * Put the square image at the left. Center the label vertically
         * to the right with the same margin on all sides.
         */
        contentView.addConstraint(contentView.centerYAnchor.constraint(equalTo: thumbnailImageView.centerYAnchor))
        contentView.addConstraint(contentView.heightAnchor.constraint(equalTo: thumbnailImageView.heightAnchor))
        
        contentView.addConstraint(contentView.centerYAnchor.constraint(equalTo: label.centerYAnchor))
        contentView.addConstraint(contentView.heightAnchor.constraint(greaterThanOrEqualTo: label.heightAnchor, constant: 2 * margin))
        
        thumbnailImageView.addConstraint(thumbnailImageView.widthAnchor.constraint(equalTo: thumbnailImageView.heightAnchor))
        
        contentView.addConstraint(contentView.leftAnchor.constraint(equalTo: thumbnailImageView.leftAnchor))
        contentView.addConstraint(thumbnailImageView.rightAnchor.constraint(equalTo: label.leftAnchor, constant: -margin))
        contentView.addConstraint(contentView.rightAnchor.constraint(equalTo: label.rightAnchor, constant: -margin))
        
        /*
         * Make contentView fill its superview.
         */
        addConstraint(centerXAnchor.constraint(equalTo: contentView.centerXAnchor))
        addConstraint(centerYAnchor.constraint(equalTo: contentView.centerYAnchor))
        addConstraint(widthAnchor.constraint(equalTo: contentView.widthAnchor))
        addConstraint(heightAnchor.constraint(equalTo: contentView.heightAnchor))
    }
    
    private func updatePlanetData() {
        defer {
            setNeedsLayout()
        }

        guard let planetData = planetData else {
            thumbnailImageView.image = nil
            label.attributedText = nil
            return
        }

        thumbnailImageView.image = UIImage(named: planetData.title)

        let font = UIFont(name: Style.boldFontName, size: Style.rowFontSize)
        let attributes: [String: Any] = [
            NSFontAttributeName: font!,
            NSKernAttributeName: 1.2
        ]

        label.attributedText = NSAttributedString(string: planetData.title, attributes: attributes)
        label.textAlignment = .left
    }
}
