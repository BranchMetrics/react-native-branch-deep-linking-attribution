require "xcodeproj"
require_relative "../helper/update_helper"

module Fastlane
  module Actions
    class UpdateNativeSdksAction < Action
      class << self
        def run(params)
          @params = params

          @android_subdir = File.expand_path 'android', '.'
          @ios_subdir = File.expand_path 'ios', '.'

          # Update embedded Android SDK
          update_android_dependency if @android_update_needed

          # Update embedded iOS SDK
          if @ios_update_needed
            update_pods_in_tests_and_examples
          end

          commit if params[:commit]
        end

        def available_options
          [
            FastlaneCore::ConfigItem.new(key: :android_checkout,
                                 description: "A commit, tag or branch to check out in the Android SDK instead of the latest tag",
                                     optional: true,
                                         type: String),
            FastlaneCore::ConfigItem.new(key: :ios_checkout,
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
                                   is_string: false)
          ]
        end

        def verbose?
          @params[:verbose]
        end

        def commit
          message = "[Fastlane] Branch native SDK update:"
          message << " #{@android_version} (Android)," if @android_update_needed
          message << " #{@ios_version} (iOS)" if @ios_update_needed

          sh "git", "commit", "-a", "-m", message.chomp(",")
        end

        def update_android_dependency
          # Patch build.gradle
          other_action.patch(
            files: "#{@android_subdir}/build.gradle",
            mode: :replace,
            regexp: /(io.branch.sdk.android:library:)\d\.\d\.\d/,
            text: "\\1#{@android_version}"
          )
        end

        def headers_build_phase
          @project.targets.first.headers_build_phase
        end

        def source_build_phase
          @project.targets.first.source_build_phase
        end
      end
    end
  end
end
