import branch, { BranchEvent } from 'react-native-branch';

import { AppConfig } from './../common/AppConfig';

let appConfig: AppConfig = AppConfig.getInstance();
export interface CreateContent {
    contentIdentifier: string;
    contentTitle: string;
    contentDescription: string;
    imageURL: string;
}
export const createContentReference = async (props: CreateContent): Promise<boolean> => {
    let response = await appConfig.createBranchObject(props, appConfig.getMetaData());
    return response.hasOwnProperty('ident');
};
export const createContentReferenceWithIndex = async (props: CreateContent): Promise<boolean> => {
    let response = await appConfig.createBranchObjectWithLocalIndex(props, appConfig.getMetaData());
    return response.hasOwnProperty('ident');
};
interface GenerateURL {
    channelName: string;
    shareFeature: string;
    campaignName: string;
    desktopURL: string;
    androidURL: string;
    iosURL: string;
    additionalData: string;
    stage: string;
}
export const generateURL = async (props: GenerateURL): Promise<object> => {
    let linkProperties = {
        feature: props.shareFeature,
        channel: props.channelName,
        campaign: props.campaignName,
        stage: props.stage,
    };
    let controlParams = {
        $desktop_url: props.desktopURL,
        $android_url: props.androidURL,
        $ios_url: props.iosURL,
        custom: props.additionalData,
    };
    try {
        let response = await appConfig.branchUniverSalObject.generateShortUrl(linkProperties, controlParams);
        return response;
    } catch (err) {
        return {};
    }
};

export const shareDeepLink = async (props: GenerateURL): Promise<void> => {
    let shareOptions = {
        messageHeader: 'Check this out',
        messageBody: 'No really, check this out!',
    };

    let linkProperties = {
        feature: props.shareFeature,
        channel: props.channelName,
    };

    let controlParams = {
        $desktop_url: props.desktopURL,
        $android_url: props.androidURL,
        $ios_url: props.iosURL,
    };

    let { channel, completed, error } = await appConfig.branchUniverSalObject.showShareSheet(shareOptions, linkProperties, controlParams);
};
export const navigateToContent = async (): Promise<object> => {
    let response = await branch.subscribe(({ error, params, uri }) => {
        if (error) {
            console.error('Error from Branch: ' + error);
            return {};
        }
        // params will never be null if error is null
        if (params['+non_branch_link']) {
            const nonBranchUrl = params['+non_branch_link'];
            // Route non-Branch URL if appropriate.
            return {};
        }
        if (!params['+clicked_branch_link']) {
            // A Branch link opened.
            // Route link based on data in params
            return { params: params, uri: uri };
        }
    });
    return response;
};
export const readDeepLink = async (): Promise<object> => {
    try {
        let response = await branch.getLatestReferringParams(); // params from last open
        let installParams = await branch.getFirstReferringParams(); // params from original install
        return { lastParams: response, installParams: installParams };
    } catch (err) {
        return { lastParams: {}, installParams: {} };
    }
};
export const handleLink = (url: string): void => {
    branch.openURL(url);
};
export const trackContent = (key: string, params: object): object => {
    let event = {};
    const actionMap = {
        [BranchEvent.AddToCart]: (): void => {
            event = new BranchEvent(BranchEvent.AddToCart, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.AddToWishlist]: (): void => {
            event = new BranchEvent(BranchEvent.AddToWishlist, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.ViewCart]: (): void => {
            event = new BranchEvent(BranchEvent.ViewCart, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.InitiatePurchase]: (): void => {
            event = new BranchEvent(BranchEvent.InitiatePurchase, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.AddPaymentInfo]: (): void => {
            event = new BranchEvent(BranchEvent.AddPaymentInfo, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Purchase]: (): void => {
            event = new BranchEvent(BranchEvent.Purchase, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.ViewAd]: (): void => {
            event = new BranchEvent(BranchEvent.ViewAd, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.ClickAd]: (): void => {
            event = new BranchEvent(BranchEvent.ClickAd, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Reserve]: (): void => {
            event = new BranchEvent(BranchEvent.Reserve, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
    };
    actionMap[key] && actionMap[key]();
    return event;
};
export const trackContentContent = (key: string, params: object): object => {
    let event = {};
    const actionMap = {
        [BranchEvent.Search]: (): void => {
            event = new BranchEvent(BranchEvent.Search, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.ViewItem]: (): void => {
            event = new BranchEvent(BranchEvent.ViewItem, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.ViewItems]: (): void => {
            event = new BranchEvent(BranchEvent.ViewItems, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Rate]: (): void => {
            event = new BranchEvent(BranchEvent.Rate, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Share]: (): void => {
            event = new BranchEvent(BranchEvent.Share, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
    };
    actionMap[key] && actionMap[key]();
    return event;
};

export const trackContentLifeCycle = (key: string, params: object): object => {
    let event = {};
    const actionMap = {
        [BranchEvent.CompleteRegistration]: (): void => {
            event = new BranchEvent(BranchEvent.CompleteRegistration, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.CompleteTutorial]: (): void => {
            event = new BranchEvent(BranchEvent.CompleteTutorial, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.AchieveLevel]: (): void => {
            event = new BranchEvent(BranchEvent.AchieveLevel, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.UnlockAchievement]: (): void => {
            event = new BranchEvent(BranchEvent.UnlockAchievement, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Invite]: (): void => {
            event = new BranchEvent(BranchEvent.Invite, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Login]: (): void => {
            event = new BranchEvent(BranchEvent.Login, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.Subscribe]: (): void => {
            event = new BranchEvent(BranchEvent.Subscribe, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
        [BranchEvent.StartTrial]: (): void => {
            event = new BranchEvent(BranchEvent.StartTrial, [appConfig.branchUniverSalObject], params);
            event.logEvent();
        },
    };
    actionMap[key] && actionMap[key]();
    return event;
};
export const branchCustomEvent = (name: string, params: object) => {
    let event = new BranchEvent(name, [appConfig.branchUniverSalObject], params);
    event.logEvent();
    return event;
};
export const getUsers = () => {
    branch.setIdentity('qentelli_test_user');
};
