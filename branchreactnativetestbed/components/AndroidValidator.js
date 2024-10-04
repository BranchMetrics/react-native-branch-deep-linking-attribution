
import VersionCheck from 'react-native-version-check';
import { NativeModules } from 'react-native';
const { ManifestHelper } = NativeModules;

export default class AndroidValidator {
    static checkAndroidInitialization() {
        //check that the native layer components initialized successfully for Android
    }

    static getBranchKeys = async() => {
        let key = await this.getManifestValue('io.branch.sdk.BranchKey')
        console.log(key)
        return key
    }

    static getPackageName() {
        return VersionCheck.getPackageName();
    }

    static checkURIScheme() {
        //check if the URI scheme in the manifest matches the URI scheme in the dashboard
    }

    static checkAppLinks() {
        //check that app links have been configured properly
    }

    static checkCustomDomain() {
        //check if the custom domain has been setup and added to the manifest
    }

    static checkDefaultDomains() {
        //check if the default domains have been added to the manifest
    }

    static checkAltDomains() {
        //check if the alternate domains have been added to the manifest
    }

    static async getManifestValue(key) {
        try {
            const value = await ManifestHelper.getManifestValue(key);
            return value
        } catch (error) {
            console.error(error);
        }
    };
}