require "xcodeproj"

module Fastlane
  module Actions
    class SetupBranchAction < Action
      def self.run(params)
        helper = Helper::BranchHelper

        live_key = params[:live_key]
        test_key = params[:test_key]
        domains = helper.domains_from_params params

        UI.message("##### Branch:")
        UI.message(" live key: #{live_key}")
        UI.message(" test key: #{test_key}")
        UI.message(" domains: #{domains}")

        # raises
        xcodeproj = Xcodeproj::Project.open params[:xcodeproj]

        helper.add_keys_to_info_plist xcodeproj, live_key, test_key
        helper.add_universal_links_to_project xcodeproj, domains, params[:remove_existing_domains]

        if params[:update_bundle_and_team_ids]
          helper.update_team_and_bundle_ids_from_aasa_file(xcodeproj, domains.first)
        end

        xcodeproj.save
      rescue => e
        UI.user_error! "Error in SetupBranchAction: #{e.message}"
      end

      def self.description
        "Adds Branch keys, custom URI schemes and domains to iOS and Android projects."
      end

      def self.authors
        ["Jimmy Dee"]
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
      end

      def self.details
        # Optional:
        "More to come"
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(key: :xcodeproj,
                                  env_name: "BRANCH_XCODEPROJ",
                               description: "Path to the Xcode project to modify",
                                  optional: false,
                                      type: String),
          FastlaneCore::ConfigItem.new(key: :live_key,
                                  env_name: "BRANCH_LIVE_KEY",
                               description: "The Branch live key for your app",
                                  optional: false,
                                      type: String),
          FastlaneCore::ConfigItem.new(key: :test_key,
                                  env_name: "BRANCH_TEST_KEY",
                               description: "The Branch test key for your app",
                                  optional: false,
                                      type: String),
          FastlaneCore::ConfigItem.new(key: :domains,
                                  env_name: "BRANCH_DOMAINS",
                               description: "Branch (and/or non-Branch) Universal Link/App Link domains to add (comma-separated list or array)",
                                  optional: true,
                                 is_string: false),
          FastlaneCore::ConfigItem.new(key: :app_link_subdomain,
                                  env_name: "BRANCH_APP_LINK_SUBDOMAIN",
                               description: "app.link subdomain",
                                  optional: true,
                                      type: String),
          FastlaneCore::ConfigItem.new(key: :update_bundle_and_team_ids,
                                  env_name: "BRANCH_UPDATE_BUNDLE_AND_TEAM_IDS",
                               description: "If set to true, updates the bundle and team identifiers to match the AASA file",
                                  optional: true,
                             default_value: false,
                                 is_string: false),
          FastlaneCore::ConfigItem.new(key: :remove_existing_domains,
                                  env_name: "BRANCH_REMOVE_EXISTING_DOMAINS",
                               description: "If set to true, removes any existing UL domains before adding Branch domains",
                                  optional: true,
                             default_value: false,
                                 is_string: false)
        ]
      end

      def self.is_supported?(platform)
        platform == :ios
        # [:ios, :android].contains platform # Add Android once available
      end
    end
  end
end
