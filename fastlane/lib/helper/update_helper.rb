require 'fileutils'

module UpdateHelper
  def update_pods_in_tests_and_examples(params)
    # Updates to CocoaPods for unit tests and examples (requires
    # node_modules for each)
    %w[
      examples/testbed_native_ios
      examples/webview_example_native_ios
      examples/webview_example
      examples/browser_example
      examples/testbed_simple
      .
    ].each do |folder|
      other_action.yarn package_path: File.join('..', folder, 'package.json')

      pods_folder = case folder
      when '.'
        'native-tests/ios'
      when /webview_example_native_ios$/
        folder
      else
        "#{folder}/ios"
      end

      FastlaneCore::UI.message "Updating Pods in #{pods_folder}"
      command = %w[pod update]
      command << '--silent' unless params[:verbose]
      command << '--no-repo-update' unless params[:repo_update]
      Dir.chdir pods_folder do
        sh command
      end
      FastlaneCore::UI.message 'Done ✅'

      other_action.git_add(path: File.join('..', pods_folder))

      # node_modules only required for pod install. Remove to speed up
      # subsequent calls to yarn.
      FileUtils.rm_rf File.join(folder, 'node_modules')
    end
  end
end

include UpdateHelper
