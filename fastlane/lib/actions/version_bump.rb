require "fastlane/action"
require "active_support/core_ext/hash"
require "pattern_patch"
require_relative "../helper/update_helper"

module Fastlane
  module Actions
    class VersionBumpAction < Action
      class << self
        def run(params)
          version = new_version params

          UI.message "Bumping to version #{version}."

          update_package_json version
          patch_index_js version
          update_pods_in_tests_and_examples
          sh "git", "commit", "-a", "-m", "[Fastlane] Version bump to #{version}"
          sh "git", "tag", version if params[:tag]
          true
        end

        def available_options
          [
            FastlaneCore::ConfigItem.new(
              key: :version,
              type: String,
              description: "New version",
              optional: true,
              default_value: nil
            ),
            FastlaneCore::ConfigItem.new(
              key: :tag,
              is_string: false,
              description: "Whether to tag after committing",
              optional: true,
              default_value: false
            )
          ]
        end

        def update_package_json(version)
          package_json[:version] = version
          json_text = JSON.generate(
            package_json,
            indent: " " * 2,
            object_nl: "\n",
            array_nl: "\n",
            space: " "
          )

          File.write "package.json", "#{json_text}\n"
        end

        def patch_index_js(version)
          PatternPatch::Patch.new(
            regexp: /(\sVERSION\s*=\s*")\d+\.\d+\.\d+/,
            text: "\\1#{version}",
            mode: :replace
          ).apply "src/index.js"
        end

        def new_version(params)
          version = params[:version]

          if version.nil?
            # Increment version from package.json
            # Gem::Version doesn't seem to have a reasonable method for this.
            components = current_version.split(".")
            components[-1] = (components[-1].to_i + 1).to_s
            version = components.join(".")
          end

          version
        end

        def current_version
          package_json[:version]
        end

        def package_json
          return @package_json if @package_json
          @package_json = JSON.parse(File.read("package.json")).symbolize_keys
          @package_json
        end
      end
    end
  end
end
