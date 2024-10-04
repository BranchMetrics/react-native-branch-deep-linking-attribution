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

    static validate() {
        Alert.alert('Branch Integration Validator', 
            'Branch SDK Version: ' + IntegrationValidator.getBranchSDKVersion() + "\n\n" + 
            'Android:\n' +
            '\t\t• Package Name: ' + AndroidValidator.getPackageName(), 
            [{text: 'OK', onPress: () => console.log('OK Pressed')},]);
    }

    static exportLogs() {
        //export both the JS and Native layer logs, filtered by Branch
    }
}