source "https://rubygems.org"

gem "cocoapods", "~> 1.2"
gem "fastlane", "~> 2.26"
gem "travis"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval(File.read(plugins_path), binding) if File.exist?(plugins_path)
