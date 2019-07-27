# testbed_native_ios

This app illustrates how to integrate the react-react-native-branch@2.0.0-beta.1-branch SDK into a React Native component within an existing native iOS app.

The app was produced following the methodology outlined in these tutorials:

- https://facebook.github.io/react-native/docs/integration-with-existing-apps.html
- https://www.raywenderlich.com/136047/react-native-existing-app

In particular, it uses the `React`, `react-native-branch` and `Branch-SDK` pods from node_modules.

## Building

To build and run:

```bash
yarn
```

or

```bash
npm i
```

then

```bash
bundle check || bundle install
bundle exec pod install
```
