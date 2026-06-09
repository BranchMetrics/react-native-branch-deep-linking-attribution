# ReactNativeInteropTest

Test app for **Branch SDK v7.0.0-beta.2** compatibility with **React Native New Architecture** via the Interop Layer.

## Purpose

This testbed verifies that the Branch SDK works correctly with React Native 0.83.2's New Architecture (Bridgeless mode) through the Interop Layer compatibility mechanism. The Interop Layer allows legacy Native Modules to function in the New Architecture without requiring a full TurboModule migration.

## Configuration

- **React Native**: 0.83.2
- **React**: 19.2.0
- **Branch SDK**: 7.0.0-beta.2 (linked via `file:..`)
- **New Architecture**: Enabled (`newArchEnabled=true`, `RCTNewArchEnabled=true`)
- **Hermes**: Enabled

## Project Setup

### Installation

```bash
npm install
cd ios && pod install && cd ..
```

### Android

The Android app is configured with:
- Package: `com.branchsdktest`
- Main component: `ReactNativeInteropTest`
- Branch keys configured in `AndroidManifest.xml`
- Deep link schemes: `branchtest://` and `https://bnctestbed.app.link`

**Build and run:**
```bash
npm run android
```

### iOS

The iOS app is configured with:
- Bundle ID: `org.reactjs.native.example.ReactNativeInteropTest`
- Bridging header: `ReactNativeInteropTest-Bridging-Header.h` (required for RNBranch Swift access)
- Branch keys configured in `Info.plist`
- Deep link schemes: `branchtest://` and universal links

**Build and run:**
```bash
# Via xcodebuild (recommended for this project)
cd ios
xcodebuild -workspace ReactNativeInteropTest.xcworkspace \
  -scheme ReactNativeInteropTest \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'name=iPhone 16' \
  -derivedDataPath build

# Install on simulator
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/ReactNativeInteropTest.app
xcrun simctl launch booted org.reactjs.native.example.ReactNativeInteropTest
```

**Note**: `npx react-native run-ios` may have issues due to project renaming. Use xcodebuild directly.

## Testing Branch Deep Linking

### Test Link
```
https://bnctestbed.app.link/jKTLDNseP3b
```

This link contains test data:
- `feature`: "final-pr-test"
- `campaign`: "v7-beta2"
- `test_data`: "New Architecture Verified"

### Android Testing
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://bnctestbed.app.link/jKTLDNseP3b" \
  com.branchsdktest
```

Check logs:
```bash
adb logcat | grep "BranchWrapper\|RNBranch"
```

### iOS Testing
```bash
xcrun simctl openurl booted "https://bnctestbed.app.link/jKTLDNseP3b"
```

## Key Files

### React Native
- `App.tsx` - Main UI with Branch functionality test buttons
- `components/BranchWrapper.ts` - Branch SDK wrapper with all integration methods
- `metro.config.js` - Configured to resolve local SDK via `file:..` link

### Android
- `android/app/src/main/java/com/branchsdktest/MainActivity.kt` - Branch session initialization
- `android/app/src/main/java/com/branchsdktest/MainApplication.kt` - Branch auto-instance setup
- `android/app/src/main/AndroidManifest.xml` - Branch keys and intent filters
- `android/gradle.properties` - `newArchEnabled=true`

### iOS
- `ios/ReactNativeInteropTest/AppDelegate.swift` - Branch session initialization
- `ios/ReactNativeInteropTest/ReactNativeInteropTest-Bridging-Header.h` - Objective-C bridging for RNBranch
- `ios/ReactNativeInteropTest/Info.plist` - Branch keys, URL schemes, `RCTNewArchEnabled=true`

## Branch Features Tested

The app UI provides buttons to test:

### Linking
- Create Branch Link
- Share Branch Link
- Generate QR Code

### Data
- View Install Params
- View Latest Params
- Set Attribution Level
- Set User ID
- Clear User ID
- Toggle Tracking

### Events
- Send Purchase Event
- Send Content Event
- Send Lifecycle Event
- Register View

### Testing
- Validate SDK Integration

## Important Notes

1. **Metro Configuration**: The `metro.config.js` includes `watchFolders` and custom `nodeModulesPaths` to resolve the parent SDK directory via the `file:..` link.

2. **iOS Bridging Header**: Required for Swift to access Objective-C RNBranch APIs. Configured in Xcode build settings: `SWIFT_OBJC_BRIDGING_HEADER = "ReactNativeInteropTest/ReactNativeInteropTest-Bridging-Header.h"`

3. **Project Naming**: The project was renamed from `BranchSDKTest` to `ReactNativeInteropTest`. Some xcodebuild derived data may still reference the old name.

4. **New Architecture Verification**: Check that the app is running in New Architecture mode by looking for "Bridgeless" or "Fabric" in logs during startup.

5. **Interop Layer**: This is the compatibility mechanism that allows the Branch SDK (a legacy Native Module) to work with New Architecture without requiring TurboModule migration. Valid for RN 0.73.0 through 0.84.x.

## Branch SDK Integration Points

The SDK is integrated at these key points:

**Android:**
- `MainApplication.onCreate()` - `RNBranchModule.getAutoInstance()`
- `MainActivity.onStart()` - `RNBranchModule.initSession()`
- `MainActivity.onNewIntent()` - `RNBranchModule.onNewIntent()`

**iOS:**
- `application(didFinishLaunchingWithOptions:)` - `RNBranch.initSession()`
- `application(open:options:)` - `RNBranch.application()`
- `application(continue:restorationHandler:)` - `RNBranch.continue()`

## Troubleshooting

**iOS build fails with "Cannot find RNBranch":**
- Ensure bridging header exists and is configured in build settings
- Run `pod install` to ensure RNBranch is linked

**Metro can't resolve react-native-branch:**
- Ensure `metro.config.js` has `watchFolders` and `nodeModulesPaths` configured
- Restart metro with `--reset-cache`: `npm start -- --reset-cache`

**Android deep link not working:**
- Verify app is in foreground or background (not terminated)
- Check `adb logcat` for Branch initialization logs
- Ensure intent filters are in AndroidManifest.xml

**iOS deep link not working:**
- Check Info.plist has Branch keys and URL schemes
- Verify AppDelegate has Branch initialization code
- Use `xcrun simctl openurl` to test on simulator
