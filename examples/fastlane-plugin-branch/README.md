# branch plugin

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

This may evolve into a public Fastlane plugin. For now, it is used with the example apps in this repo.
