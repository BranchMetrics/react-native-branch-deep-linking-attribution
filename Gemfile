source "https://rubygems.org"

# CP 1.7 breaks our #imports. For now, pin for the unit tests and examples.
gem "cocoapods", "~> 1.6.0"
gem "fastlane", "~> 2.69"
gem "rubocop"
gem "travis"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
