//
//  RCTLog.swift
//  WebViewExample
//
//  Created by Jimmy Dee on 4/5/17.
//  Copyright © 2017 Branch Metrics. All rights reserved.
//

func RCTLogError(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    let fileName = file.components(separatedBy: "/").last!
    RCTSwiftLog.error("[\(fileName):\(line)] \(message)")
}

func RCTLogWarn(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    let fileName = file.components(separatedBy: "/").last!
    RCTSwiftLog.warn("[\(fileName):\(line)] \(message)")
}

func RCTLogInfo(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    let fileName = file.components(separatedBy: "/").last!
    RCTSwiftLog.info("[\(fileName):\(line)] \(message)")
}

func RCTLog(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    let fileName = file.components(separatedBy: "/").last!
    RCTSwiftLog.log("[\(fileName):\(line)] \(message)")
}

func RCTLogTrace(_ message: String, _ file: String=#file, _ line: UInt=#line) {
    let fileName = file.components(separatedBy: "/").last!
    RCTSwiftLog.trace("[\(fileName):\(line)] \(message)")
}
