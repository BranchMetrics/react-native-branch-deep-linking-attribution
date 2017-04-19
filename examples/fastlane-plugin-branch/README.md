# branch plugin

## TL;DR

This is a work in progress. Currently it can add Branch keys and Universal Link domains to an Xcode project.
To try it out:
```
bundle install
bundle exec fastlane test
git status
git diff
```

Open BranchPluginExample.xcworkspace in the BranchPluginExample subdirectory. It now has the branch_key
(both live and test) and the Universal Link domains for bnctestbed.app.link.

Android remains to be done. Also, the setup_branch (iOS) action should probably support target and
configuration options. Currently it chooses the first non-extension, non-test target in the project
and adds the same settings for all configurations.

The rest of this README was generated and has not been updated. You can stop here.

[![fastlane Plugin Badge](https://rawcdn.githack.com/fastlane/fastlane/master/fastlane/assets/plugin-badge.svg)](https://rubygems.org/gems/fastlane-plugin-branch)

## Getting Started

This project is a [_fastlane_](https://github.com/fastlane/fastlane) plugin. To get started with `fastlane-plugin-branch`, add it to your project by running:

```bash
fastlane add_plugin branch
```

## About branch

Adds Branch keys, custom URI schemes and domains to iOS and Android projects.

**Note to author:** Add a more detailed description about this plugin here. If your plugin contains multiple actions, make sure to mention them here.

## Example

Check out the [example `Fastfile`](fastlane/Fastfile) to see how to use this plugin. Try it by cloning the repo, running `fastlane install_plugins` and `bundle exec fastlane test`.

**Note to author:** Please set up a sample project to make it easy for users to explore what your plugin does. Provide everything that is necessary to try out the plugin in this project (including a sample Xcode/Android project if necessary)

## Run tests for this plugin

To run both the tests, and code style validation, run

```
rake
```

To automatically fix many of the styling issues, use
```
rubocop -a
```

## Issues and Feedback

For any other issues and feedback about this plugin, please submit it to this repository.

## Troubleshooting

If you have trouble using plugins, check out the [Plugins Troubleshooting](https://docs.fastlane.tools/plugins/plugins-troubleshooting/) guide.

## Using _fastlane_ Plugins

For more information about how the `fastlane` plugin system works, check out the [Plugins documentation](https://docs.fastlane.tools/plugins/create-plugin/).

## About _fastlane_

_fastlane_ is the easiest way to automate beta deployments and releases for your iOS and Android apps. To learn more, check out [fastlane.tools](https://fastlane.tools).
