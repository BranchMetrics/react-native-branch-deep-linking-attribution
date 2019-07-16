source 'https://rubygems.org'

gem 'cocoapods', '~> 1.6'
gem 'fastlane', '~> 2.69'
gem 'travis'
# Try to keep scan stable
gem 'xcodeproj', '~> 1.10.0'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
