/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  ImageSourcePropType,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { VERSION } from 'react-native-branch';

import BranchWrapper from './components/BranchWrapper';

interface MyState {
  modalVisible: boolean;
  qrCodeImage: string;
  trackingDisabled: boolean;
}

interface BranchButton {
  text: string;
  onPress: Function;
  image: ImageSourcePropType;
}

interface BranchSection {
  sectionName: string;
  branchButtons: BranchButton[];
}

class App extends React.Component<any, MyState> {
  branchWrapper: BranchWrapper;
  linking: BranchButton[];
  data: BranchButton[];
  events: BranchButton[];
  sections: BranchSection[];

  constructor(props: any) {
    super(props);

    this.state = {
      modalVisible: false,
      qrCodeImage:
        'https://snack-web-player.s3.us-west-1.amazonaws.com/v2/46/static/media/react-native-logo.79778b9e.png',
      trackingDisabled: false,
    };

    this.branchWrapper = new BranchWrapper();

    this.linking = [
      {
        text: 'Create Branch Link',
        onPress: this.branchWrapper.createBranchLink.bind(this),
        image: require('./images/share_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Share Branch Link',
        onPress: this.branchWrapper.shareBranchLink.bind(this),
        image: require('./images/send_FILL0_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Create QR Code',
        onPress: () => {
          this.branchWrapper
            .createQRCode()
            .then(result => {
              this.setState(prevState => {
                return {
                  ...prevState,
                  qrCodeImage: result,
                  modalVisible: true,
                };
              });
            })
            .catch(err => console.error('error ' + err));
        },
        image: require('./images/qr_code_2_FILL0_wght400_GRAD0_opsz48.png'),
      },
    ];

    this.data = [
      {
        text: 'View Install Params',
        onPress: this.branchWrapper.viewFirstReferringParams.bind(this),
        image: require('./images/download_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Set Attribution Level',
        onPress: () => this.branchWrapper.setConsumerProtectionAttributionLevel('REDUCED'),
        image: require('./images/person_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'View Latest Params',
        onPress: this.branchWrapper.viewLatestReferringParams.bind(this),
        image: require('./images/bolt_FILL0_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Set User ID',
        onPress: () => this.branchWrapper.setUserIdAsync('rntest'),
        image: require('./images/person_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Clear User ID',
        onPress: this.branchWrapper.logout.bind(this),
        image: require('./images/person_off_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Toggle Tracking',
        onPress: () => {
          let trackingPromise = this.branchWrapper.toggleTracking();
          trackingPromise
            .then(result => {
              this.setState(prevState => {
                return {
                  ...prevState,
                  trackingDisabled: result,
                };
              });
            })
            .catch(err => console.error('error ' + err));
        },
        image: require('./images/location_disabled_FILL1_wght400_GRAD0_opsz48.png'),
      },
    ];

    this.events = [
      {
        text: 'Send Purchase Event',
        onPress: this.branchWrapper.sendPurchaseEvent.bind(this),
        image: require('./images/attach_money_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Send Content Event',
        onPress: this.branchWrapper.sendContentEvent.bind(this),
        image: require('./images/description_FILL0_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Send Lifecycle Event',
        onPress: this.branchWrapper.sendLifecycleEvent.bind(this),
        image: require('./images/cycle_FILL1_wght400_GRAD0_opsz48.png'),
      },
      {
        text: 'Register View',
        onPress: this.branchWrapper.registerView.bind(this),
        image: require('./images/visibility_FILL1_wght400_GRAD0_opsz48.png'),
      },
    ];

    this.sections = [
      { sectionName: 'Linking', branchButtons: this.linking },
      { sectionName: 'Data', branchButtons: this.data },
      { sectionName: 'Events', branchButtons: this.events },
    ];
  }

  componentDidMount() {
    this.branchWrapper.componentDidMount();
  }

  componentWillUnmount() {
    if (this.branchWrapper) {
      this.branchWrapper.componentWillUnmount();
    }
  }

  render() {
    const { modalVisible, qrCodeImage } = this.state;

    let modal = (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false });
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState(prevState => {
              return {
                ...prevState,
                modalVisible: false,
              };
            });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.qrCodeImage}
                source={{
                  uri: qrCodeImage,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );

    return (
      <SafeAreaView style={styles.container}>
        {modal}
        <Text style={styles.versionText}>
          {'react-native-branch ' + VERSION}
        </Text>
        <ScrollView style={styles.scrollView}>
          {this.sections.map((section, index) => {
            return (
              <View key={index}>
                <Text style={styles.sectionText}>{section.sectionName}</Text>
                {section.branchButtons.map((branchButton, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.button}
                      onPress={branchButton.onPress}>
                      <Image
                        source={branchButton.image}
                        style={styles.buttonImageIconStyle}
                      />
                      <Text style={styles.buttonText}>{branchButton.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  versionText: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginRight: 15,
  },
  scrollView: {
    marginHorizontal: 30,
  },
  sectionText: {
    color: '#0074DF',
    fontSize: 30,
    paddingVertical: 5,
  },
  editText: {
    fontSize: 20,
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  buttonText: {
    flex: 0.8,
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#0074DF',
  },
  buttonImageIconStyle: {
    flex: 0.2,
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 250,
    width: 250,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  qrCodeImage: {
    height: 200,
    width: 200,
  },
});
