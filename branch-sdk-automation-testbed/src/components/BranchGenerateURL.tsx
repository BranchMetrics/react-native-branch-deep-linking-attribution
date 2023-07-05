import { KeyboardAvoidingView, NativeModules, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NAVIGATION_PARAM, ROUTES, testIds } from './constant/constant';
import React, { useEffect } from 'react';
import { generateURL, shareDeepLink } from '../helper/BranchHelper';

import { resources } from './constant/colors';
import { transkeys } from './translations/en';
import { useRoute } from '@react-navigation/native';

const { ReadLogs } = NativeModules;

const BranchGenerateURL = ({ navigation }) => {
    const [channelName, onChangeChannelName] = React.useState('');
    const [shareFeature, onChangeShareFeature] = React.useState('');
    const [campaignName, onChangeCampaignName] = React.useState('');
    const [desktopURL, onChangeDesktopURL] = React.useState('');
    const [androidURL, onChangeAndroidURL] = React.useState('');
    const [iosURL, onChangeIOSURL] = React.useState('');
    const [additionalData, onChangeAdditionalData] = React.useState('');
    const [stage, onChangeStage] = React.useState('');

    const route = useRoute();

    useEffect(() => {
        ReadLogs.createLogFile();
    }, []);

    const onPressSubmit = async (): Promise<void> => {
        const response = await generateURL({ channelName, shareFeature, campaignName, desktopURL, androidURL, iosURL, additionalData, stage });

        if (route.params.routeID == NAVIGATION_PARAM.ROUTE_SHARE_DEEPLINK) {
            const shareResponse = await shareDeepLink({ channelName, shareFeature, campaignName, desktopURL, androidURL, iosURL, additionalData, stage });
            navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: shareResponse });
        } else if (route.params.routeID === NAVIGATION_PARAM.ROUTE_TRACK_CONTENT) {
            navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: response, routeID: NAVIGATION_PARAM.ROUTE_CREATE_DEEP_LINK });
        } else {
            navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: response, routeID: route.params.routeID });
        }
    };
    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TextInput
                    style={styles.input}
                    testID={testIds.inputChannelName}
                    onChangeText={(_text: string) => onChangeChannelName(_text)}
                    value={channelName}
                    placeholder={transkeys.inputChannelName}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputShareFeature}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeShareFeature(_text)}
                    value={shareFeature}
                    placeholder={transkeys.inputShareFeature}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    style={styles.input}
                    testID={testIds.inputCampaignName}
                    onChangeText={(_text: string) => onChangeCampaignName(_text)}
                    value={campaignName}
                    placeholder={transkeys.inputCampaignName}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    style={styles.input}
                    testID={testIds.inputStageTestId}
                    onChangeText={(_text: string) => onChangeStage(_text)}
                    value={stage}
                    placeholder={transkeys.inputStage}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputDesktopURL}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeDesktopURL(_text)}
                    value={desktopURL}
                    placeholder={transkeys.inputDesktopURL}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputAndroidURL}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeAndroidURL(_text)}
                    value={androidURL}
                    placeholder={transkeys.inputAndroidURL}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputIosURL}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeIOSURL(_text)}
                    value={iosURL}
                    placeholder={transkeys.inputIosURL}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputAdditionalData}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeAdditionalData(_text)}
                    value={additionalData}
                    placeholder={transkeys.inputAdditionalData}
                    placeholderTextColor={resources.color.black}
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnSubmit} onPress={() => onPressSubmit()}>
                        <Text style={styles.titleStyle}>{transkeys.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 4,
        color: resources.color.black,
    },
    buttonStyle: {
        marginTop: 15,
        padding: 10,
        backgroundColor: resources.color.purple_700,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        minWidth: 150,
    },
    titleStyle: {
        color: resources.color.white,
        fontWeight: '500',
    },
});

export default BranchGenerateURL;
