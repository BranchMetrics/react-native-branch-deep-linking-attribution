# testbed_simple

This app illustrates the simplest means of integrating react-native-branch into a React Native app. This app was generated using the following commands:

```bash
react-native init testbed_simple
cd testbed_simple
yarn add ../.. # from local repo
react-native link
```

CocoaPods and Carthage are not required for iOS.

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
cd ios
bundle check || bundle install
bundle exec pod install
```

Note when using `npm install` it will be necessary first to modify the
react-native-branch requirement in package.json from `file:../..` to
`^4.1.0`.
