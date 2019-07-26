# webview_example

This app presents a list of the planets in a React Native ListView. When each
row is tapped, a custom Article component is displayed using the React Native
Navigator.

The Article component contains a WebView and displays the Wikipedia page for the
selected planet. The Article component creates a Branch Universal Object in
`componentWillMount` and registers a view event. A large Share button at the
bottom of the Article component calls `showShareSheet` on the BUO.

In the App component, a `branch.subscribe` callback routes inbound links and
pushes an Article component for the appropriate article when a link is opened.

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

## AndroidX note

Several dependencies of this app (react-native-screens
and react-native-gesture-handler) had not been updated to AndroidX when last
checked. It is necessary manually to convert them to AndroidX using the tools
in AndroidStudio. Alternately, after running `yarn` to install the contents
of `node_modules`, you can run

```bash
cp -r ../androidx-deps/* node_modules
```

This will copy updated Java source for the versions in the yarn.lock into the
build tree so that an Android build will succeed.
