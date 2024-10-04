export default class IOSValidator {

    static checkIOSInitialization() {
        //check that the native layer components initialized successfully for iOS
    }

    static checkBranchKeys() {
        //check that the Branch keys are present in the Info.plist file
    }

    static checkNativeLink() {
        //check if the copy to clipboard code for NativeLink was added 
    }

    static checkDefaultDomains() {
        //check if the default domains were added to the Info.plist
        //check if the default domains were added to the Associated Domains
    }

    static checkAltDomains() {
        //check if the alt domains were added to the Info.plist
        //check if the alt domains were added to the Associated Domains
    }

    static checkURIScheme() {
        //check if the URI scheme was added to the Info.plist
        //check if the URI scheme matches the URI scheme on the Branch dashboard
    }

    static checkBundleID() {
        //check if the bundle ID matches the bundle ID on the dashboard
    }

    static checkTeamID() {
        //check if the team ID matches the team ID on the dashboard
    }

    static checkIfIDFAIsAccessible() {
        //check if the user has allowed tracking with the ATT prompt
    }
}