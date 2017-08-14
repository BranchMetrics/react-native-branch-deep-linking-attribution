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
          @project = Xcodeproj::Project.open "#{ios_subdir}/RNBranch.xcodeproj"
          ios_subdir_pathname = Pathname.new ios_subdir

          # 1. Find all SDK .h, .m files and add any not already in the project.
          Dir[File.expand_path "#{ios_subdir}/Branch-SDK/**/*.[hm]", ios_subdir].each do |filename|
            # Avoid TestBed and tests. (alternatives: parse the podspec for the source_files or
            # restructure the ios repo so that the SDK is well separated)
            # Ignore any files already in the project.
            next if filename =~ /Test/ || @project.files.find { |f| f.real_path.to_s == filename }

            # New file. Look for the group.
            group_pathname = Pathname.new(File.dirname(filename)).relative_path_from(ios_subdir_pathname)
            group = ensure_group_at_path group_pathname

            file_basename = File.basename filename
            file = group.new_file file_basename

            if filename =~ /\.h$/
              copy_branch_sdk_headers_build_phase.add_file_reference file
            else
              source_build_phase.add_file_reference file
            end
          end

          # check_file_refs

          # 2. Make sure all files in the project still exist. Remove those that do not.
          @project.files.each do |file|
            next if File.exist? file.real_path
            # file.remove_from_project # results in nil file_ref in build phases
            file.parent.children.delete file
            if file.path =~ /\.h$/
              copy_branch_sdk_headers_build_phase.remove_file_reference file
            else
              source_build_phase.remove_file_reference file
            end
          end

          # check_file_refs

          # 3. Remove any empty groups from the project
          remove_empty_groups @project.main_group

          # check_file_refs

          @project.save
          UI.message "Updated ios/RNBranch.xcodeproj"
        end

        def ensure_group_at_path(pathname)
          subgroup = @project.main_group[pathname.to_s]
          return subgroup unless subgroup.nil?

          dirname, basename = pathname.split
          parent = ensure_group_at_path dirname

          parent.new_group basename.to_s, basename.to_s
        end

        def remove_empty_groups(group)
          group.groups.each { |g| remove_empty_groups g }
          group.remove_from_project if group.empty?
        end

        def check_file_refs
          [copy_branch_sdk_headers_build_phase, source_build_phase].each do |build_phase|
            build_phase.files.each do |build_file|
              raise "nil file_ref in #{build_phase.display_name}" if build_file.file_ref.nil?
            end
          end
        end

        def copy_branch_sdk_headers_build_phase
          target = @project.targets.first
          target.build_phases.find { |phase| phase.respond_to?(:name) && phase.name == "Copy Branch SDK Headers" }
        end

        def source_build_phase
          @project.targets.first.source_build_phase
        end
      end
    end
  end
end
