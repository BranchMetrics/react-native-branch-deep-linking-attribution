import { Platform, NativeModules } from 'react-native';

let RNBranch;

if (Platform.OS === 'ios' || Platform.OS === 'android') {
    RNBranch = NativeModules.RNBranch;
} else {
  throw new Error('Unsupported platform');
}

export default RNBranch;
