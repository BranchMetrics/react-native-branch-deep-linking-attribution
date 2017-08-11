module Fastlane
  module Actions
    class UpdateNativeSdksAction < Action
      class << self
        UI = FastlaneCore::UI

        def run(params)
          # TODO: Update submodules

          # TODO: Android

          ios_subdir = File.expand_path 'ios', '.'
          update_branch_podspec_from_submodule ios_subdir
        end

        def available_options
          []
        end

        def update_branch_podspec_from_submodule(ios_subdir)
          # Copy the podspec from the submodule
          `cp #{ios_subdir}/Branch-SDK/Branch.podspec #{ios_subdir}/Branch-SDK.podspec`
          UI.user_error! "Unable to update #{ios_subdir}/Branch-SDK.podspec" unless $?.exitstatus == 0

          # Change the pod name to Branch-SDK
          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: /(s\.name\s*)= "Branch"/,
            mode: :replace,
            text: '\1= "Branch-SDK"'
          )

          # Add s.header_dir = "Branch" (also determines the module name)
          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: /s.requires_arc.*$/,
            mode: :append,
            text: "\n  s.header_dir       = \"Branch\""
          )

          # Add an additional Branch-SDK/ path component to all paths to account for the submodule
          other_action.apply_patch(
            files: "#{ios_subdir}/Branch-SDK.podspec",
            regexp: %r{(['"]Branch-SDK/)},
            mode: :replace,
            text: '\1Branch-SDK/',
            global: true
          )

          UI.message "Updated #{ios_subdir}/Branch-SDK.podspec"
        end
      end
    end
  end
end
