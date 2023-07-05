import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
const branchChannelID = 'BranchChannelID';
export const LocalNotification = (navigation: any, url: string) => {
    if (Platform.OS === 'ios') {
        sendNotification(url);
    } else {
        PushNotification.createChannel(
            {
                channelId: branchChannelID,
                channelName: 'BranchChannel',
            },
            () => {
                sendNotification(url);
            }
        );
    }
    navigation.goBack();
};
const sendNotification = (url: string) => {
    PushNotification.localNotification({
        channelId: branchChannelID,
        autoCancel: true,
        title: 'BranchTest',
        message: url,
    });
};
