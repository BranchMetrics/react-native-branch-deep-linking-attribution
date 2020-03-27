require 'cocoapods'
require 'fileutils'
require 'pathname'
require 'xcodeproj'

module UpdateHelper
  UI = FastlaneCore::UI

  def sh(*cmd, chdir: '.')
    Dir.chdir chdir do
      Fastlane::Action.sh(*cmd) do |status, result, command|
        message = "Command #{command} (pid #{status.pid})"
        if status.success?
          UI.message "#{message} succeeded."
        else
          UI.user_error! "#{message} failed with status #{status.exitstatus}."
        end
      end
    end
  end

  def boolean_env_var?(varname, default_value: nil)
    varstr = ENV[varname.to_s]
    return default_value if varstr.nil?
    varstr =~ /^[ty]/i
  end

  def pod_install_required?(podfile_folder)
    podfile_folder = File.expand_path podfile_folder
    podfile_path = File.join podfile_folder, 'Podfile'
    raise ArgumentError, "No Podfile at #{podfile_folder}" unless File.readable?(podfile_path)

    # Podfile must be evalled in its current directory in order to resolve
    # the require_relative at the top.
    podfile = Dir.chdir(podfile_folder) { Pod::Podfile.from_file podfile_path }

    # From here on we expect pod install to succeed. We just check whether it's
    # necessary. The Podfile.from_file call above can raise if the Podfile
    # contains errors. In that case, pod install will also fail, so we allow
    # the exception to be raised instead of returning true.

    lockfile_path = File.join podfile_folder, 'Podfile.lock'
    manifest_path = File.join podfile_folder, 'Pods', 'Manifest.lock'

    return true unless File.readable?(lockfile_path) && File.readable?(manifest_path)

    begin
      # This validates the Podfile.lock for yaml formatting at least and makes
      # the lockfile hash available to check the Podfile checksum later.
      lockfile = Pod::Lockfile.from_file Pathname.new lockfile_path

      # diff the contents of Podfile.lock and Pods/Manifest.lock
      # This is just what is done in the "[CP] Check Pods Manifest.lock" script
      # build phase in a project using CocoaPods. This is a stricter requirement
      # than semantic comparison of the two lockfile hashes.
      return true unless File.read(lockfile_path) == File.read(manifest_path)

      # compare checksum of Podfile with checksum in Podfile.lock in case Podfile
      # updated since last pod install/update.
      lockfile.to_hash["PODFILE CHECKSUM"] != podfile.checksum
    rescue StandardError, Pod::PlainInformative => e
      # Any error from Pod::Lockfile.from_file or File.read after verifying a
      # file exists and is readable. pod install will regenerate these files.
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

  def update_pods_in_tests_and_examples(context = nil,
    verbose: nil,
    repo_update: nil,
    include_examples: false
  )
    verbose = boolean_env_var?(:REACT_NATIVE_BRANCH_VERBOSE, default_value: false) if verbose.nil?
    repo_update = boolean_env_var?(:REACT_NATIVE_BRANCH_REPO_UPDATE, default_value: true) if repo_update.nil?

    # Updates to CocoaPods for unit tests and examples (requires
    # node_modules for each)

    folders = %w[.]

    folders += %w[
      examples/browser_example
      examples/testbed_native_ios
      examples/testbed_simple
      examples/webview_example
      examples/webview_example_native_ios
    ] if include_examples

    if context.nil?
      # From an Action
      project_root = '.'
      context = other_action
    else
      # From the Fastfile
      project_root = '..'
    end

    folders.each do |folder|
      package_folder = File.expand_path File.join(project_root, folder)
      context.yarn project_root: package_folder

      pods_folder = case folder
      when '.'
        'native-tests/ios'
      when /webview_example_native_ios$/
        folder
      else
        "#{folder}/ios"
      end

      UI.message "Updating Pods in #{pods_folder}"
      command = %w[pod update]
      command << '--silent' unless verbose
      command << '--no-repo-update' unless repo_update
      pods_folder = File.expand_path File.join(project_root, pods_folder)
      Dir.chdir pods_folder do
        sh command
      end
      UI.message 'Done ✅'

      context.git_add path: pods_folder
    end
  end

  def update_rnbranch_xcodeproj(version)
    rnbranch_option = %[RNBRANCH_VERSION=@\\"#{version}\\"]
    project = Xcodeproj::Project.open 'ios/RNBranch.xcodeproj'
    project.build_configurations.each do |config|
      options = config.build_settings['GCC_PREPROCESSOR_DEFINITIONS']
      options = options.reject { |o| o =~ /^RNBRANCH_VERSION=/ }
      options << rnbranch_option
      config.set_setting 'GCC_PREPROCESSOR_DEFINITIONS', options
    end
    project.save
  end

  def update_npm_deps(context, include_examples: false)
    folders = %w[.]

    folders += %w[
      browser_example
      testbed_native_android
      testbed_native_ios
      testbed_simple
      webview_example
      webview_example_carthage
      webview_example_native_ios
      webview_tutorial
    ] if include_examples

    folders.each do |ex|
      path = case ex
      when '.'
        ex
      else
        "examples/#{ex}"
      end

      Dir.chdir File.expand_path("../../../#{path}", __dir__) do |folder|
        UI.message "Updating #{ex}"
        UI.message "Removing #{folder}/node_modules and #{folder}/package-lock.json before updating"
        FileUtils.rm_rf %w[node_modules package-lock.json].map { |f| File.join(folder, f) }
        sh 'npm', 'install'
        context.yarn project_root: folder, command: 'upgrade'
        # Not having much luck with builtin git actions
        sh 'git', 'add', '.'

        UI.message 'Done ✅'
      end
    end
  end
end

include UpdateHelper
