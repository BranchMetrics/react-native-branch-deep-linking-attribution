require 'cocoapods'
require 'fileutils'
require 'pathname'

module UpdateHelper
  UI = FastlaneCore::UI

  def boolean_env_var?(varname, default_value: nil)
    varstr = ENV[varname.to_s]
    return default_value if varstr.nil?
    varstr =~ /^[ty]/i
  end

  def pod_install_required?(podfile_folder)
    podfile_folder = File.expand_path podfile_folder
    podfile_path = File.join podfile_folder, 'Podfile'
    raise ArgumentError, "No Podfile at #{podfile_folder}" unless File.readable?(podfile_path)

    lockfile_path = File.join podfile_folder, 'Podfile.lock'
    manifest_path = File.join podfile_folder, 'Pods', 'Manifest.lock'

    return true unless File.readable?(lockfile_path) && File.readable?(manifest_path)

    begin
      lockfile = Pod::Lockfile.from_file Pathname.new lockfile_path
      manifest = Pod::Lockfile.from_file Pathname.new manifest_path

      # diff the contents of Podfile.lock and Pods/Manifest.lock
      # This is just what is done in the "[CP] Check Pods Manifest.lock" script build phase
      # in a project using CocoaPods, but it also validates YAML parsing, etc.
      return true unless lockfile == manifest

      # Podfile must be evalled in its current directory in order to resolve
      # the require_relative at the top.
      podfile = Dir.chdir(podfile_folder) { Pod::Podfile.from_file podfile_path }

      # compare checksum of Podfile with checksum in Podfile.lock in case Podfile
      # updated since last pod install/update.
      return true unless lockfile.to_hash["PODFILE CHECKSUM"] == podfile.checksum

      false
    rescue StandardError => e
      UI.error e.message
      true
    end
  end

  def pod_install_if_required(podfile_folder, verbose: false, repo_update: true)
    podfile_folder = File.expand_path podfile_folder
    install_required = pod_install_required? podfile_folder
    UI.message "pod install #{install_required ? '' : 'not '}required in #{podfile_folder}"
    return unless install_required

    command = %w[pod install]
    command << '--silent' unless verbose
    command << '--repo-update' if repo_update

    Dir.chdir(podfile_folder) { Fastlane::Action.sh(*command) }
  end

  def update_pods_in_tests_and_examples(params)
    # Updates to CocoaPods for unit tests and examples (requires
    # node_modules for each)

    folders = %w[.]

    folders += %w[
      examples/browser_example
      examples/testbed_native_ios
      examples/testbed_simple
      examples/webview_example
      examples/webview_example_native_ios
    ] if params[:include_examples]

    folders.each do |folder|
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

  def sh(*cmd, chdir: '.')
    Dir.chdir chdir do
      Fastlane::Action.sh *cmd do |status, result, command|
        message = "Command #{command} (pid #{status.pid})"
        if status.success?
          FastlaneCore::UI.message "#{message} succeeded."
        else
          FastlaneCore::UI.user_error! "#{message} failed with status #{status.exitstatus}."
        end
      end
    end
  end
end

include UpdateHelper
