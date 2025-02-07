import {Alert} from 'react-native';
import branch, {BranchEvent} from 'react-native-branch';

export default class BranchWrapper {
  buo: any;
  _unsubscribeFromBranch: any;

  constructor() {
    this.createBranchUniversalObject();
  }

  componentDidMount() {
    console.log('BranchWrapper componentDidMount');

    this._unsubscribeFromBranch = branch.subscribe({
      onOpenStart: ({uri, cachedInitialEvent}) => {
        console.log(
          'BranchWrapper subscribe onOpenStart, will open ' +
            uri +
            ' cachedInitialEvent is ' +
            cachedInitialEvent,
        );
      },
      onOpenComplete: ({error, params, uri}) => {
        if (error) {
          console.error(
            'BranchWrapper subscribe onOpenComplete, Error from opening uri: ' +
              uri +
              ' error: ' +
              error,
          );
          return;
        }

        if (params) {
          if (!params['+clicked_branch_link']) {
            if (params['+non_branch_link']) {
              console.log('BranchWrapper non_branch_link: ' + uri);
              return;
            }

            // handle params
            let title = params.$og_title;
            let url = params.$canonical_url as string;
            console.log(
              'BranchWrapper opened ' +
                uri +
                ' title: ' +
                title +
                ' canonical url: ' +
                url,
            );
          }
        }
      },
    });
  }

  componentWillUnmount() {
    console.log('BranchWrapper componentWillUnmount');
    if (this._unsubscribeFromBranch) {
      console.log('BranchWrapper unsubscribe');
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }

    if (this.buo) {
      console.log('BranchWrapper buo release');
      this.buo.release();
      this.buo = null;
    }
  }

  createBranchUniversalObject = async () => {
    if (this.buo) {
      return;
    }

    this.buo = await branch.createBranchUniversalObject('content/12345', {
      title: 'My Content Title',
      contentDescription: 'My Content Description',
      contentMetadata: {
        customMetadata: {
          key1: 'value1',
        },
      },
    });
  };

  createBranchLink = async () => {
    if (!this.buo) {
      await this.createBranchUniversalObject();
    }

    let linkProperties = {
      feature: 'sharing',
      channel: 'facebook',
      campaign: 'content 123 launch',
    };

    let controlParams = {
      $desktop_url: 'https://example.com/home',
      custom: 'data',
    };

    let {url} = await this.buo.generateShortUrl(linkProperties, controlParams);
    console.log('BranchWrapper ' + url);
    this.createAlert('Created Branch Link', url);
  };

  shareBranchLink = async () => {
    let shareOptions = {
      messageHeader: 'Check this out',
      messageBody: 'No really, check this out!',
    };

    let linkProperties = {
      feature: 'sharing',
      channel: 'facebook',
    };

    let controlParams = {
      $desktop_url: 'http://example.com/home',
      $ios_url: 'http://example.com/ios',
    };

    let {channel, completed, error} = await this.buo.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );

    console.log(
      'channel ' + channel + ' completed ' + completed + ' error ' + error,
    );
  };

  createQRCode = async () => {
    var qrCodeSettings = {
      width: 512,
      codeColor: '#57dbe0',
      backgroundColor: '#2a2e2e',
      centerLogo:
        'https://cdn.branch.io/branch-assets/1598575682753-og_image.png',
      margin: 2,
      imageFormat: 'PNG',
    };

    var buoOptions = {
      title: 'A Test Title',
      contentDescription: 'A test content desc',
      contentMetadata: {
        price: '200',
        productName: 'QR Code Scanner',
        customMetadata: {someKey: 'someValue', anotherKey: 'anotherValue'},
      },
    };
    var lp = {
      feature: 'qrCode',
      tags: ['test', 'working'],
      channel: 'facebook',
      campaign: 'posters',
    };

    var controlParams = {
      $desktop_url: 'https://www.desktop.com',
      $fallback_url: 'https://www.fallback.com',
    };

    try {
      var result = await branch.getBranchQRCode(
        qrCodeSettings,
        buoOptions,
        lp,
        controlParams,
      );

      return Promise.resolve('data:image/png;base64,' + result);
    } catch (err) {
      return Promise.reject('BranchWrapper QR Code Err: ' + err);
    }
  };

  logout = async () => {
    branch.logout();
  };

  viewFirstReferringParams = async () => {
    let params = await branch.getFirstReferringParams();
    this.createAlert('Install referring params', JSON.stringify(params));
  };

  viewLatestReferringParams = async () => {
    let params = await branch.getLatestReferringParams();
    this.createAlert('Latest referring params', JSON.stringify(params));
  };

  setUserIdAsync = async (identity: string) => {
    console.log('BranchWrapper setUserIdAsync ' + identity);
    await branch
      .setIdentityAsync(identity)
      .then(function () {
        console.log(
          'BranchWrapper setIdentityAsync promise resolved successfully',
        );
      })
      .catch(function () {
        console.error('BranchWrapper setIdentityAsync promise was rejected');
      });
  };

  setConsumerProtectionAttributionLevel = (level: 'FULL' | 'REDUCED' | 'MINIMAL' | 'NONE') => {
    console.log('BranchWrapper setConsumerProtectionAttributionLevel ' + level);
    branch.setConsumerProtectionAttributionLevel(level);
    this.createAlert('Attribution Level Set', `Level set to: ${level}`);
  };

  toggleTracking = async () => {
    let trackingDisabled = await branch.isTrackingDisabled();

    branch.disableTracking(!trackingDisabled);
    return Promise.resolve(!trackingDisabled);
  };

  sendPurchaseEvent = async () => {
    let params = {
      transaction_id: 'tras_Id_1232343434',
      currency: 'USD',
      revenue: 180.2,
      shipping: 10.5,
      tax: 13.5,
      coupon: 'promo-1234',
      affiliation: 'high_fi',
      description: 'Preferred purchase',
      purchase_loc: 'Palo Alto',
      store_pickup: 'unavailable',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };

    let event = new BranchEvent(BranchEvent.Purchase, this.buo, params);
    console.log('BranchWrapper logging event ' + JSON.stringify(event));
    event.logEvent();
  };

  sendContentEvent = async () => {
    let params = {
      alias: 'my custom alias',
      description: 'Product Search',
      searchQuery: 'user search query terms for product xyz',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };

    let event = new BranchEvent(BranchEvent.Search, [], params);
    console.log('BranchWrapper logging event ' + JSON.stringify(event));
    event.logEvent();
  };

  sendLifecycleEvent = async () => {
    let params = {
      alias: 'my custom alias',
      transaction_id: 'tras_Id_1234',
      description: 'Preferred purchase',
      registration_id: '12345',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };

    let event = new BranchEvent(BranchEvent.CompleteRegistration, [], params);
    console.log('BranchWrapper logging event ' + JSON.stringify(event));
    event.logEvent();
  };

  registerView = async () => {
    let params = {
      alias: 'my custom alias',
      transaction_id: 'tras_Id_1234',
      description: 'Preferred purchase',
      registration_id: '12345',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };

    let event = new BranchEvent(BranchEvent.ViewItem, [], params);
    console.log('BranchWrapper logging event ' + JSON.stringify(event));
    event.logEvent();
  };

  createAlert = (title: string, message: string) =>
    Alert.alert(title, message, [], {
      cancelable: true,
      onDismiss: () =>
        console.log(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    });

    validateSDKIntegration = () => {
      branch.validateSDKIntegration();
    };
}
