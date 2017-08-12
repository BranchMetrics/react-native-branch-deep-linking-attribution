require "xcodeproj"

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
          adjust_rnbranch_xcodeproj ios_subdir
        end

        def available_options
          []
        end

        def update_branch_podspec_from_submodule(ios_subdir)
          branch_sdk_podspec_path = "#{ios_subdir}/Branch-SDK.podspec"

          # Copy the podspec from the submodule
          `cp #{ios_subdir}/native-sdk/Branch.podspec #{branch_sdk_podspec_path}`
          UI.user_error! "Unable to update #{branch_sdk_podspec_path}" unless $?.exitstatus == 0

          # Change the pod name to Branch-SDK
          other_action.apply_patch(
            files: branch_sdk_podspec_path,
            regexp: /(s\.name\s*)= "Branch"/,
            mode: :replace,
            text: '\1= "Branch-SDK"'
          )

          # Add s.header_dir = "Branch" (also determines the module name)
          other_action.apply_patch(
            files: branch_sdk_podspec_path,
            regexp: /s.requires_arc.*$/,
            mode: :append,
            text: "\n  s.header_dir       = \"Branch\""
          )

          UI.message "Updated #{ios_subdir}/Branch-SDK.podspec"
        end

        def adjust_rnbranch_xcodeproj(ios_subdir)
          project = Xcodeproj::Project.open "#{ios_subdir}/RNBranch.xcodeproj"
          ios_subdir_pathname = Pathname.new ios_subdir

          Dir[File.expand_path "#{ios_subdir}/Branch-SDK/**/*.[hm]", ios_subdir].each do |header|
            next if header =~ /Test/ || project.files.find { |f| f.real_path.to_s == header }

            # New file. Look for the group.
            group_pathname = Pathname.new(File.dirname(header)).relative_path_from(ios_subdir_pathname)
            group = ensure_group_at_path project, group_pathname

            group.new_file File.basename(header)

            target = project.targets.first

            if header =~ /\.h$/
              target.header_build_phase
            end
          end

          project.save
        end

        def ensure_group_at_path(project, pathname)
          subgroup = project.main_group[pathname.to_s]
          return subgroup unless subgroup.nil?

          dirname, basename = pathname.split
          parent = ensure_group_at_path project, dirname

          parent.new_group basename.to_s, basename.to_s
        end
      end
    end
  end
end
