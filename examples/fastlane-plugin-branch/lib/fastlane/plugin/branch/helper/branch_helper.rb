require "plist"

module Fastlane
  module Helper
    class BranchHelper
      class << self
        def domains_from_params(params)
          if params[:domains].nil?
            app_link_subdomain = params[:app_link_subdomain]
            raise ":domains or :app_link_subdomain must be set" if app_link_subdomain.nil?

            return [
              "#{app_link_subdomain}.app.link",
              "#{app_link_subdomain}-alternate.app.link",
              "#{app_link_subdomain}.test-app.link",
              "#{app_link_subdomain}-alternate.test-app.link"
            ]
          end

          domains = params[:domains]

          if domains.kind_of? Array
            domains = domains.map(&:to_s)
          elsif domains.kind_of? String
            domains = domains.split(",")
          else
            raise "Unsupported type #{domains.class.name} for :domains key"
          end

          domains
        end

        def add_keys_to_info_plist(project, live_key, test_key)
          # find the first application target
          target = project.targets.find { |t| !t.extension_target_type? && !t.test_target_type? }

          raise "No application target found" if target.nil?

          # find the Info.plist paths for all configurations
          info_plist_paths = target.resolved_build_setting "INFOPLIST_FILE"

          raise "INFOPLIST_FILE not found in target" if info_plist_paths.nil? or info_plist_paths.empty?

          # this can differ from one configuration to another.
          # take from Release for now.
          # TODO: Add an optional configuration: parameter
          release_info_plist_path = info_plist_paths["Release"]

          raise "Info.plist not found for configuration Release" if release_info_plist_path.nil?

          project_parent = File.dirname project.path

          release_info_plist_path = File.join project_parent, release_info_plist_path

          # try to open and parse the Info.plist (raises)
          info_plist = Plist.parse_xml release_info_plist_path

          # add Branch key(s)
          info_plist["branch_key"] = {live: live_key, test: test_key}

          Plist::Emit.save_plist info_plist, release_info_plist_path
        end

        def add_universal_links_to_project(project, domains, remove_existing)
          # find the first application target
          target = project.targets.find { |t| !t.extension_target_type? && !t.test_target_type? }

          raise "No application target found" if target.nil?

          # TODO: Handle different configurations
          relative_entitlements_path = target.resolved_build_setting("CODE_SIGN_ENTITLEMENTS")["Release"]
          project_parent = File.dirname project.path

          if relative_entitlements_path.nil?
            relative_entitlements_path = File.join target.name, "#{target.name}.entitlements"
            entitlements_path = File.join project_parent, relative_entitlements_path

            # Add CODE_SIGN_ENTITLEMENTS setting to each configuration
            target.build_configurations.each do |config|
              config.build_settings["CODE_SIGN_ENTITLEMENTS"] = relative_entitlements_path
            end

            # Add the file to the project
            project.new_file relative_entitlements_path

            entitlements = {}
            current_domains = []
          else
            entitlements_path = File.join project_parent, relative_entitlements_path
            # Raises
            entitlements = Plist.parse_xml entitlements_path
            if remove_existing
              current_domains = []
            else
              current_domains = entitlements["com.apple.developer.associated-domains"]
            end
          end

          current_domains += domains.map { |d| "applinks:#{d}"}
          all_domains = current_domains.uniq

          entitlements["com.apple.developer.associated-domains"] = all_domains

          Plist::Emit.save_plist entitlements, entitlements_path
        end

        def update_team_and_bundle_ids_from_aasa_file(project, domain)
          team_and_bundle = team_and_bundle_ids_from_aasa_file domain
          update_team_and_bundle_ids project, *team_and_bundle
        end

        def team_and_bundle_ids_from_aasa_file(domain)
          file = JSON.parse Net::HTTP.get(domain, "/apple-app-site-association")
          identifier = file["applinks"]["details"][0]["appID"]
          team = identifier.sub /\..*$/, ""
          bundle = identifier.sub /^[^.]*\./, ""
          [ team, bundle ]
        end

        def update_team_and_bundle_ids(project, team, bundle)
          # find the first application target
          target = project.targets.find { |t| !t.extension_target_type? && !t.test_target_type? }

          raise "No application target found" if target.nil?

          target.build_configurations.each do |config|
            config.build_settings["PRODUCT_BUNDLE_IDENTIFIER"] = bundle
            config.build_settings["DEVELOPMENT_TEAM"] = team
          end

          # also update the team in the first test target
          target = project.targets.find { |t| t.test_target_type? }
          return if target.nil?

          target.build_configurations.each do |config|
            config.build_settings["DEVELOPMENT_TEAM"] = team
          end
        end
      end
    end
  end
end
