require "xcodeproj"
require_relative "../helper/update_helper"

module Fastlane
  module Actions
    class UpdateNativeSdksAction < Action
      class << self
        def run(params)
          @params = params

          update_submodules params

          return unless @android_update_needed || @ios_update_needed

          @android_subdir = File.expand_path 'android', '.'
          @ios_subdir = File.expand_path 'ios', '.'

          # Update embedded Android SDK
          update_android_jar if @android_update_needed

          # Update embedded iOS SDK
          if @ios_update_needed
            update_ios_branch_source
            update_branch_podspec_from_submodule
            adjust_rnbranch_xcodeproj
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

        def git_q_flag
          verbose? ? "" : " -q"
        end

        def commit
          message = "[Fastlane] Branch native SDK update:"
          message << " #{@android_version} (Android)," if @android_update_needed
          message << " #{@ios_version} (iOS)" if @ios_update_needed

          sh "git", "commit", "-a", "-m", message.chomp(",")
        end

        def update_submodules(params)
          UI.message "Updating native SDK submodules..."
          sh "git submodule update --init" # In case not present
          ['android', 'ios'].each do |platform|
            folder = "native-sdks/#{platform}"
            Dir.chdir(folder) do
              UI.message "Updating submodule in #{folder}"

              original_commit = current_commit

              sh "git checkout#{git_q_flag} master"
              sh "git pull --tags#{git_q_flag}" # Pull all available branch refs so anything can be checked out
              key = "#{platform}_checkout".to_sym
              commit = params[key]

              if commit
                sh "git checkout#{git_q_flag} #{commit}"
                version = commit
              else
                version = checkout_last_git_tag
              end

              update_needed = current_commit != original_commit

              instance_variable_set "@#{platform}_version", version
              instance_variable_set "@#{platform}_update_needed", update_needed

              if update_needed
                UI.success "Updated submodule in #{folder}"
              else
                UI.message "#{folder} is current. No update required."
              end
            end
          end
        end

        def current_commit
          `git rev-list HEAD --max-count=1`
        end

        def update_android_jar
          jar = Dir['native-sdks/android/Branch*.jar'].reject { |j| j =~ /core/ }.first
          version = jar.sub(/^.*Branch-/, '').sub(/\.jar$/, '')
          jar_path = File.expand_path jar, '.'

          return if File.exist? "#{@android_subdir}/libs/Branch-#{version}.jar"

          # Remove the old and add the new
          Dir.chdir("#{@android_subdir}/libs") do
            old_jars = Dir['Branch*.jar']
            sh "cp", jar_path, "."
            sh "git", "add", "Branch-#{version}.jar"
            sh "git", "rm", "-f", *old_jars unless old_jars.empty?
          end

          # Patch build.gradle
          other_action.patch(
            files: "#{@android_subdir}/build.gradle",
            mode: :replace,
            regexp: /Branch-.*\.jar/,
            text: "Branch-#{version}.jar"
          )
        end

        def update_ios_branch_source
          sh "git rm -frq ios/Branch-SDK" if File.exist? "ios/Branch-SDK"
          sh "cp -r native-sdks/ios/Branch-SDK ios"
          other_action.git_add path: File.join("..", "ios", "Branch-SDK")
        end

        def update_branch_podspec_from_submodule
          branch_sdk_podspec_path = "#{@ios_subdir}/Branch-SDK.podspec"

          # Copy the podspec from the submodule
          sh "cp", "native-sdks/ios/Branch.podspec", branch_sdk_podspec_path do |status|
            UI.user_error! "Unable to update #{branch_sdk_podspec_path}" unless status.success?
          end

          # Change the pod name to Branch-SDK
          other_action.patch(
            files: branch_sdk_podspec_path,
            regexp: /(s\.name\s*)= "Branch"/,
            mode: :replace,
            text: '\1= "Branch-SDK"'
          )

          # Add s.header_dir = "Branch" (also determines the module name)
          other_action.patch(
            files: branch_sdk_podspec_path,
            regexp: /s.requires_arc.*$/,
            mode: :append,
            text: "\n  s.header_dir       = \"Branch\""
          )

          UI.success "Updated ios/Branch-SDK.podspec"
        end

        def adjust_rnbranch_xcodeproj
          @project = Xcodeproj::Project.open "#{@ios_subdir}/RNBranch.xcodeproj"
          # check_file_refs

          ios_subdir_pathname = Pathname.new @ios_subdir

          # 1. Find all SDK .h, .m files and add any not already in the project.
          Dir[File.expand_path "#{@ios_subdir}/Branch-SDK/**/*.[hm]", @ios_subdir].each do |filename|
            # Ignore any files already in the project.
            next if @project.files.find { |f| f.real_path.to_s == filename }

            # New file. Look for the group.
            group_pathname = Pathname.new(File.dirname(filename)).relative_path_from(ios_subdir_pathname)
            group = ensure_group_at_path group_pathname

            file = group.new_file filename

            if is_header? filename
              copy_branch_sdk_headers_build_phase.add_file_reference file, true
              headers_build_phase.add_file_reference file, true
            else
              source_build_phase.add_file_reference file, true
            end
          end

          # check_file_refs

          top_group = @project['Branch-SDK']

          # 2. Make sure all files in the project still exist. Remove those that do not.
          remove_dangling_references top_group

          # check_file_refs

          # 3. Remove any empty groups from the project
          remove_empty_groups top_group

          # check_file_refs

          @project.save
          UI.success "Updated ios/RNBranch.xcodeproj"
        end

        def ensure_group_at_path(pathname)
          subgroup = @project.main_group[pathname.to_s]
          return subgroup unless subgroup.nil?

          dirname, basename = pathname.split
          parent = ensure_group_at_path dirname

          parent.new_group basename.to_s, basename.to_s
        end

        def remove_dangling_references(group)
          to_delete = []
          group.children.each do |child|
            if child.isa == "PBXGroup"
              remove_dangling_references child
            elsif child.isa == "PBXFileReference"
              next if File.exist? child.real_path
              if is_header? child.path
                copy_branch_sdk_headers_build_phase.remove_file_reference child
                headers_build_phase.remove_file_reference child
              else
                source_build_phase.remove_file_reference child
              end
              to_delete << child
            end
          end

          to_delete.each { |f| f.parent.children.delete f }
        end

        def remove_empty_groups(group)
          group.groups.each { |g| remove_empty_groups g }
          group.remove_from_project if group.empty?
        end

        def is_header?(path)
          path =~ /\.(h|pch)$/
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

        def headers_build_phase
          @project.targets.first.headers_build_phase
        end

        def source_build_phase
          @project.targets.first.source_build_phase
        end

        def checkout_last_git_tag
          commit = `git rev-list --tags='[0-9]*.[0-9]*.[0-9]*' --max-count=1`
          tag = `git tag --contains #{commit}`.chomp
          sh "git checkout#{git_q_flag} #{tag}"
          tag
        end
      end
    end
  end
end
