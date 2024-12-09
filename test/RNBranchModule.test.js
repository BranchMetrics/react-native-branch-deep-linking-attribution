import { Platform, NativeModules } from 'react-native';

describe('RNBranch module', () => {
  let originalPlatform;
  let originalRNBranch;

  beforeEach(() => {
    jest.resetModules();
    originalPlatform = Platform.OS;
    originalRNBranch = NativeModules.RNBranch;
  });

  afterEach(() => {
    Platform.OS = originalPlatform;
    NativeModules.RNBranch = originalRNBranch;
    jest.restoreAllMocks();
  });

  describe('Platform-specific tests', () => {
    it('should use NativeModules.RNBranch for iOS', () => {
      Platform.OS = 'ios';
      NativeModules.RNBranch = { mockInit: jest.fn() };

      const RNBranch = require('../src/RNBranch').default;
      expect(RNBranch).not.toBeNull();
      expect(RNBranch).toBe(NativeModules.RNBranch);
    });

    it('should use NativeModules.RNBranch for Android', () => {
      Platform.OS = 'android';
      NativeModules.RNBranch = { mockInit: jest.fn() };

      const RNBranch = require('../src/RNBranch').default;
      expect(RNBranch).not.toBeNull();
      expect(RNBranch).toBe(NativeModules.RNBranch);
    });

    it('should throw an error for unsupported platforms', () => {
      Platform.OS = 'unsupportedPlatform';

      expect(() => {
        require('../src/RNBranch');
      }).toThrow('Unsupported platform');
    });
  });

  describe('Null tests', () => {
    it('should be null when NativeModules.RNBranch is null for iOS', () => {
      Platform.OS = 'ios';
      NativeModules.RNBranch = null;

      const RNBranch = require('../src/RNBranch').default;
      expect(RNBranch).toBeNull();
    });

    it('should be null when NativeModules.RNBranch is null for Android', () => {
      Platform.OS = 'android';
      NativeModules.RNBranch = null;

      const RNBranch = require('../src/RNBranch').default;
      expect(RNBranch).toBeNull();
    });
  });
});

