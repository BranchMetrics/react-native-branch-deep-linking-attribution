# coding: utf-8

lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fastlane/plugin/branch/version'

Gem::Specification.new do |spec|
  spec.name          = 'fastlane-plugin-branch'
  spec.version       = Fastlane::Branch::VERSION
  spec.author        = 'Jimmy Dee'
  spec.email         = 'jgvdthree@gmail.com'

  spec.summary       = 'Adds Branch keys, custom URI schemes and domains to iOS and Android projects.'
  spec.homepage      = "https://github.com/BranchMetrics/fastlane-plugin-branch"
  spec.license       = "MIT"

  spec.files         = Dir["lib/**/*"] + %w(README.md LICENSE)
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.add_dependency 'plist'

  spec.add_development_dependency 'pry'
  spec.add_development_dependency 'bundler'
  spec.add_development_dependency 'rspec'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'rubocop'
  spec.add_development_dependency 'fastlane', '>= 2.26.1'
end
