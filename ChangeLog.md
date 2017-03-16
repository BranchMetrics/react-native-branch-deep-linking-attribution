2017-01-13  Version 1.0.0

  * Support for react-native 0.40.0
  * Configuration changes to support various toolchains
  * Full support for Carthage

2017-01-31  Version 0.9.1

  * Fixed unsubscribe bug (#73)
  * Full support for Carthage
  * Support all parameters of Branch Universal Object and link properties

2017-01-31  Version 1.0.1

  * Fixed unsubscribe bug (#73)
  * Support all parameters of Branch Universal Object and link properties

2017-02-06  Version 0.9.2

  * Corrected peerDependencies

2017-02-06  Version 1.0.2

  * Corrected peerDependencies
  * Fixed [an issue](https://github.com/BranchMetrics/react-native-branch-deep-linking/pull/93) that prevented App Store submission

2017-02-15  Version 0.9.3

  * Reduced iOS deploy target from 9.2 to 8.0.

2017-02-15  Version 1.0.4

  * Reduced iOS deploy target from 9.2 to 8.0.

2017-02-24  Version 0.9.5

  * Improved support for manual installation of Branch SDK
  * Fix for non-Branch links with Universal Links on iOS

2017-02-24  Version 1.0.5

  * Improved support for manual installation of Branch SDK
  * Fix for non-Branch links with Universal Links on iOS

2017-03-16  Version 0.9.6

  * Corrected a react-native version limitation in the build.gradle to ensure the version from node_modules is used.

2017-03-16  Version 1.1.0

  * This release introduces a userCompletedAction() method on the Branch Universal Object. The registerView() method
  is deprecated in favor of userCompletedAction(RegisterViewEvent).
  * The createBranchUniversalObject() method now allocates native resources supporting the BUO. These are eventually
  cleaned up when unused for some time. An optional release() method is also provided to ensure they are released
  immediately, e.g. when componentWillUnmount() is called.
  * Corrected a react-native version limitation in the build.gradle to ensure the version from node_modules is used.
  * The native iOS dependencies for the testbed apps were updated to 0.13.5.
