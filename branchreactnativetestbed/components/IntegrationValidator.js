import { Alert } from 'react-native';

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
            'Branch SDK Version: ' + IntegrationValidator.getBranchSDKVersion(), 
            [{text: 'OK', onPress: () => console.log('OK Pressed')},]);
    }
}