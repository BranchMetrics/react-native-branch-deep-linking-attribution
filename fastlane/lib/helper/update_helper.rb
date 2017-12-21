module UpdateHelper
  def update_pods_in_tests_and_examples
    # Updates to CocoaPods for unit tests and examples (requires
    # node_modules for each)
    %w{
      examples/testbed_native_ios
      examples/webview_example_native_ios
      .
    }.each do |folder|
      other_action.yarn package_path: File.join("..", folder, "package.json")

      pods_folder = folder

      # The Podfile there installs from node_modules in the repo root.
      pods_folder = "native-tests/ios" if folder == "."

      other_action.cocoapods(
        # relative to fastlane folder when using other_action
        podfile: File.join("..", pods_folder, "Podfile"),
        silent: true,
        use_bundle_exec: true
      )

      other_action.git_add(path: File.join("..", pods_folder))

      # node_modules only required for pod install. Remove to speed up
      # subsequent calls to yarn.
      sh "rm", "-fr", File.join(folder, "node_modules")
    end
  end
end

include UpdateHelper
