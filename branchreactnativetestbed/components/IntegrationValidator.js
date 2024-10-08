import { Alert } from 'react-native';
import AndroidValidator from './AndroidValidator';

export default class IntegrationValidator {
    static getBranchSDKVersion() {
        const packageJson = require('../package.json');
        const sdkVersion = packageJson.dependencies['react-native-branch'];

        if (!sdkVersion) {
            console.warn('react-native-branch dependency not found in package.json');
            return 'Version not found';
        }

        return sdkVersion
    }

    static showBranchSDKVersionMessage() {
        var branchSDKVersion = 'Branch React Native SDK Version: ' + this.getBranchSDKVersion();
        Alert.alert(branchSDKVersion);
        console.log(branchSDKVersion);
    }

    static validate() {
        let packageName = AndroidValidator.getPackageName()
        AndroidValidator.getBranchKeys().then( keys => {
                Alert.alert('Branch Integration Validator', 
                    'Branch SDK Version: ' + IntegrationValidator.getBranchSDKVersion() + "\n\n" + 
                    'Android:\n' +
                    '\nPackage Name: ' + '\n' + 
                    '• ' + AndroidValidator.getPackageName() + '\n' + 
                    '\nBranch Keys: ' + '\n' + 
                    '• ' +  keys[0] + '\n' + 
                    '• ' +  keys[1], 
                    [{text: 'OK', onPress: () => console.log('OK Pressed')},]);
            }
        );
    }

    static exportLogs() {
        //export both the JS and Native layer logs, filtered by Branch
    }
}