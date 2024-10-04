export default class AndroidValidator {
    static checkAndroidInitialization() {
        //check that the native layer components initialized successfully for Android
    }

    static checkBranchKeys() {
        //check that the Branch keys are present in the AndroidManifest file
    }

    static checkPackageName() {
        //check if the package name of the app matches the one from the dashboard
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
}