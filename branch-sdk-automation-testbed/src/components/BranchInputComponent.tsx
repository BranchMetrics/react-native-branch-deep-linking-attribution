import { KeyboardAvoidingView, NativeModules, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NAVIGATION_PARAM, ROUTES, TRACK_CONTENT_TYPE, testIds } from './constant/constant';
import React, { useEffect, useState } from 'react';
import { branchCustomEvent, createContentReference, createContentReferenceWithIndex, trackContent, trackContentContent, trackContentLifeCycle } from '../helper/BranchHelper';

import { AppConfig } from '../common/AppConfig';
import { CustomModal } from '../common/CustomModal';
import { resources } from './constant/colors';
import { styles } from '../common/common.style';
import { transkeys } from './translations/en';
import { useRoute } from '@react-navigation/native';

let appConfig: AppConfig = AppConfig.getInstance();
const { ReadLogs } = NativeModules;
const BranchInputComponent = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [contentIdentifier, onChangeContentIdentifier] = React.useState('');
    const [contentTitle, onChangeContentTitle] = React.useState('');
    const [contentDescription, onChangeContentDescription] = React.useState('');
    const [imageURL, onChangeImageURL] = React.useState('');
    const onPressOnMetadataButton = (): void => {
        appConfig.clearMetaData();
        navigation && navigation.navigate(ROUTES.ADD_META_DATA);
    };
    const route = useRoute();
    useEffect(() => {
        ReadLogs.createLogFile();
    }, []);
    const [message, setMessage] = useState({ title: '', subtitle: '' });
    const onPressSubmit = async (): Promise<void> => {
        let response = false;
        if (route.params.routeID !== NAVIGATION_PARAM.ROUTE_DISPLAY_CONTENT) {
            response = await createContentReference({ contentIdentifier, contentTitle, contentDescription, imageURL });
        } else {
            response = await createContentReferenceWithIndex({ contentIdentifier, contentTitle, contentDescription, imageURL });
        }
        if (response) {
            if (route.params.routeID === NAVIGATION_PARAM.ROUTE_TRACK_CONTENT) {
                const { params, selectedEvent, type } = route.params;
                switch (type) {
                    case TRACK_CONTENT_TYPE.COMMERCE: {
                        let trackContentResponse = trackContent(selectedEvent, params);
                        navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: trackContentResponse, routeID: route.params?.routeID });
                        break;
                    }
                    case TRACK_CONTENT_TYPE.CONTENT: {
                        const responseContent = trackContentContent(selectedEvent, params);
                        navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: responseContent, routeID: route.params?.routeID });
                        break;
                    }
                    case TRACK_CONTENT_TYPE.LIFECYCLE: {
                        const lifeCycleResponse = trackContentLifeCycle(selectedEvent, params);
                        navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: lifeCycleResponse, routeID: route.params?.routeID });
                        break;
                    }
                    case TRACK_CONTENT_TYPE.CUSTOM: {
                        const lifeCycleResponse = branchCustomEvent(selectedEvent, params);
                        navigation && navigation.replace(ROUTES.MESSAGE_DISPLAY, { response: lifeCycleResponse, routeID: route.params?.routeID });
                        break;
                    }
                }

                return;
            }
            setMessage({ title: transkeys.successTitle, subtitle: transkeys.createBUOSuccessMessage });
        } else {
            setMessage({ title: transkeys.failureTitle, subtitle: transkeys.createBUOFailureMessage });
        }
        setModalVisible(true);
    };
    const onClose = (): void => {
        setModalVisible(false);
        setTimeout(() => {
            if (route.params.routeID !== NAVIGATION_PARAM.ROUTES_CREATE_CONTENT_REFERENCE && route.params.routeID !== NAVIGATION_PARAM.ROUTE_DISPLAY_CONTENT) {
                let routeID = ROUTES.BRANCH_GENERATE_URL;
                navigation &&
                    navigation.replace(routeID, {
                        routeID: route.params.routeID,
                    });
            } else {
                navigation.goBack();
            }
        }, 1000);
    };
    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TextInput
                    style={styles.input}
                    testID={testIds.inputContentIdentifier}
                    onChangeText={(_text: string) => onChangeContentIdentifier(_text)}
                    value={contentIdentifier}
                    placeholder={transkeys.CanonicalIdentifier}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputContentTitle}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeContentTitle(_text)}
                    value={contentTitle}
                    placeholder={transkeys.ContentTitle}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    style={styles.input}
                    testID={testIds.inputContentDescription}
                    onChangeText={(_text: string) => onChangeContentDescription(_text)}
                    value={contentDescription}
                    placeholder={transkeys.ContentDescription}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputImageURL}
                    style={styles.input}
                    onChangeText={(_text: string) => onChangeImageURL(_text)}
                    value={imageURL}
                    placeholder={transkeys.ImageUrl}
                    placeholderTextColor={resources.color.black}
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnAddMetadata} onPress={(): void => onPressOnMetadataButton()}>
                        <Text style={styles.titleStyle}>{transkeys.AddMetaData}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnSubmit} onPress={(): Promise<void> => onPressSubmit()}>
                        <Text style={styles.titleStyle}>{transkeys.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <CustomModal modalVisible={modalVisible} onCloseModal={onClose} title={message.title} subtitle={message.subtitle} />
        </ScrollView>
    );
};
export default BranchInputComponent;
