module Fastlane
  module Actions
    class UpdateNativeSdksAction < Action
      class << self
        UI = FastlaneCore::UI

        def run(params)
          # TODO: Update submodules

          # TODO: Android

          ios_subdir = File.expand_path 'ios', '.'
          `cp #{ios_subdir}/Branch-SDK/Branch.podspec #{ios_subdir}/Branch-SDK.podspec`
          UI.user_error! "Unable to update #{ios_subdir}/Branch-SDK.podspec" unless $?.exitstatus == 0

          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: /(s\.name\s*)= "Branch"/,
            mode: :replace,
            text: '\1= "Branch-SDK"'
          )

          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: /s.requires_arc.*$/,
            mode: :append,
            text: "\n  s.header_dir       = \"Branch\""
          )

          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: %r{(['"]Branch-SDK/)},
            mode: :replace,
            text: '\1Branch-SDK/',
            global: true
          )
        end

        def available_options
          []
        end
      end
    end
  end
end
