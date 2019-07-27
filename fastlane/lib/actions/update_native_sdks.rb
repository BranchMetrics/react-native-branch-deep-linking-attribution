require 'xcodeproj'
require_relative '../helper/update_helper'

module Fastlane
  module Actions
    class UpdateNativeSdksAction < Action
      class << self
        def run(params)
          @params = params

          @android_version = params[:android_version]
          @ios_version     = params[:ios_version]

          UI.user_error! 'Specify either android_version, ios_version or both.' unless @android_version || @ios_version

          @android_update_needed = true if @android_version
          @ios_update_needed = true if @ios_version

          # Update embedded Android SDK
          update_android_dependency if @android_update_needed

          # Update embedded iOS SDK
          if @ios_update_needed
            update_ios_dependency
            update_pods_in_tests_and_examples params
          end

          commit if params[:commit]
        end

        def available_options
          [
            FastlaneCore::ConfigItem.new(key: :android_version,
                                 description: "A commit, tag or branch to check out in the Android SDK instead of the latest tag",
                                    optional: true,
                                        type: String),
            FastlaneCore::ConfigItem.new(key: :ios_version,
                                 description: "A commit, tag or branch to checkout out in the iOS SDK instead of the latest tag",
                                    optional: true,
                                        type: String),
            FastlaneCore::ConfigItem.new(key: :commit,
                                 description: "Determines whether to commit the result to SCM",
                                    optional: true,
                               default_value: true,
                                   is_string: false),
            FastlaneCore::ConfigItem.new(key: :verbose,
                                 description: "Generate verbose output",
                                    optional: true,
                               default_value: false,
                                   is_string: false),
            FastlaneCore::ConfigItem.new(key: :include_examples,
                                   is_string: false,
                                 description: "Whether to update example lockfiles",
                                    optional: true,
                               default_value: false),
            FastlaneCore::ConfigItem.new(key: :repo_update,
                                    env_name: 'REACT_NATIVE_BRANCH_REPO_UPDATE',
                                   is_string: false,
                                 description: "Whether to update the CocoaPods repo when updating",
                                    optional: true,
                               default_value: true)
          ]
        end

        def verbose?
          @params[:verbose]
        end

        def commit
          message = "[Fastlane] Branch native SDK update:"
          message << " #{@android_version} (Android)," if @android_update_needed
          message << " #{@ios_version} (iOS)" if @ios_update_needed

          command = %w[git commit -a -m]
          command << message.chomp(',')
          sh(*command)
        end

        VERSION_REGEXP = /\w+\.\w+\.\w+/

        def update_android_dependency
          # Patch build.gradle
          other_action.patch(
            files: '../android/build.gradle',
            mode: :replace,
            regexp: /(io.branch.sdk.android:library:)#{VERSION_REGEXP}/,
            text: "\\1#{@android_version}"
          )
        end

        def update_ios_dependency
          # Patch podspec
          other_action.patch(
            files: '../react-native-branch.podspec',
            mode: :replace,
            regexp: /(\.dependency\s+['"]Branch['"]\s*,\s*['"])#{VERSION_REGEXP}/,
            text: "\\1#{@ios_version}"
          )

          # Patch RNBranch.m
          other_action.patch(
            files: '../ios/RNBranch.m',
            mode: :replace,
            regexp: /(REQUIRED_BRANCH_SDK\s*=\s*@")#{VERSION_REGEXP}/,
            text: "\\1#{@ios_version}"
          )
        end
      end
    end
  end
end
