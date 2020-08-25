import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { WebView } from 'react-native-webview';

import branch, { BranchEvent } from 'react-native-branch';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64,
  },
  textInput: {
    flex: 0.08,
  },
  webView: {
    flex: 0.77,
  },
  button: {
    backgroundColor: '#cceeee',
    borderColor: '#2266aa',
    borderTopWidth: 1,
    flex: 0.15,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#2266aa',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default class App extends Component {
  _unsubscribeFromBranch = null;
  buo = null;

  constructor(props) {
    super(props);
    this.state = { text: 'https://branch.io', url: 'https://branch.io' };
  }

  componentDidMount() {
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error("Error from Branch: " + error);
        return;
      }

      console.log("Branch params: " + JSON.stringify(params));

      if (!params['+clicked_branch_link']) {
				if (!!params['+non_branch_link']) {
					this.setState({url: params['+non_branch_link'], title: params['+non_branch_link']});
				}
				return;
			}

      // Get title and url for route
      let title = params.$og_title;
      let url = params.$canonical_url;
      let image = params.$og_image_url;

      // Now reload the webview
      this.setState({url: url, title: title, image: image});
    });
		this.registerView();
  }

  componentWillUnmount() {
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }

    if (this.buo) {
      this.buo.release();
      this.buo = null;
    }
  }

  render() {
    return (
      <View
        style={styles.container} >
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text: text})}
          onEndEditing={this.editingEnded.bind(this)}
					placeholder={'Enter Branch or non-Branch URL'}
					autoCapitalize={'none'}
					autoCompleteType={'off'}
					autoCorrect={false}
          value={this.state.text} />
        <WebView
          style={styles.webView}
          source={{uri: this.state.url}}
          onLoad={this.registerView.bind(this)} />
				<TouchableHighlight
          onPress={this.onShare.bind(this)}
          style={styles.button} >
          <Text
            style={styles.buttonText}>
            Share
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  editingEnded() {
    branch.openURL(this.state.text);
  }

  async registerView() {
    if (this.buo) this.buo.release();
    if (this.state.url === '') return;

    this.buo = await branch.createBranchUniversalObject("url/" + this.state.url, {
      canonicalUrl: this.state.url,
      title: this.state.title,
      contentImageUrl: this.state.image,
    });
    this.buo.logEvent(BranchEvent.ViewItem);
    console.log("Created Branch Universal Object and logged standard view item event.");
  }

  async onShare() {
    let { channel, completed, error } = await this.buo.showShareSheet({
      emailSubject: this.state.title,
      messageHeader: this.state.title,
    }, {
      feature: "share",
      channel: "RNApp",
    }, {
      $desktop_url: this.state.url,
      $ios_deepview: "branch_default",
    });

    if (error) {
      console.error("Error sharing via Branch: " + error);
      return;
    }

    console.log("Share to " + channel + " completed: " + completed);
  }
}
