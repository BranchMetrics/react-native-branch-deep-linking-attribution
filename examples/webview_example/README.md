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

Just install the NPM dependencies using `npm install` or `yarn`. No other setup
is required to run on a simulator.
