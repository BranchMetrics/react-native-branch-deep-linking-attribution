import { NAVIGATION_PARAM, ROUTES, testIds } from './constant/constant';
import { NativeModules, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { LocalNotification } from '../services/LocalPushController';
import { handleLink } from '../helper/BranchHelper';
import { resources } from './constant/colors';
import { transkeys } from './translations/en';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 15,
        padding: 10,
        backgroundColor: resources.color.purple_700,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        minWidth: 200,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    titleStyle: {
        color: resources.color.white,
        fontWeight: '500',
    },
    headerStyle: {
        color: resources.color.black,
        fontWeight: '500',
        fontSize: 24,
    },
    subtitleStyle: {
        color: resources.color.black,
        fontWeight: '400',
        marginTop: 10,
    },
    mainContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: resources.color.white,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: resources.color.white,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
});
const { ReadLogs } = NativeModules;
const MessageDisplayComponent = ({ navigation }) => {
    const route = useRoute();
    const { routeID } = route.params;
    const [logsData, setLogsData] = useState('');
    const getData = () => {
        ReadLogs.readLog((response: string) => {
            setLogsData(response);
        });
    };
    useEffect(() => {
        navigation.setOptions({
            title: 'Response',
        });
        setTimeout(() => {
            getData();
        }, 1000);
    }, []);
    const response = route.params?.response || {};
    const onNextPress = () => {
        ReadLogs.clearLogs();
        if (routeID === NAVIGATION_PARAM.ROUTE_HANDLE_DEEPLINK) {
            handleLink(response.url);
        } else if (routeID === NAVIGATION_PARAM.ROUTE_SEND_NOTIFICATION) {
            LocalNotification(navigation, response.url);
        } else if (routeID === NAVIGATION_PARAM.ROUTE_TRACK_CONTENT) {
            if (response.hasOwnProperty('url')) {
                navigation &&
                    navigation.replace(ROUTES.LOG_DISPLAY, {
                        url: response.url,
                        routeID: routeID,
                    });
            } else {
                let routeID = ROUTES.BRANCH_GENERATE_URL;
                navigation &&
                    navigation.replace(routeID, {
                        routeID: routeID,
                    });
            }
        } else {
            navigation &&
                navigation.replace(ROUTES.LOG_DISPLAY, {
                    url: response.url,
                    routeID: routeID,
                });
        }
    };
    return (
        <View testID={testIds.messageDisplayContainer} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={styles.headerContainer}>
                {routeID !== NAVIGATION_PARAM.ROUTE_TRACK_CONTENT && (
                    <Text style={styles.headerStyle} testID={testIds.messageDisplayHeaderText}>
                        {response.hasOwnProperty('url') ? transkeys.successTitle : transkeys.failureTitle}
                    </Text>
                )}
                {routeID !== NAVIGATION_PARAM.ROUTE_TRACK_CONTENT && (
                    <Text style={styles.subtitleStyle} testID={testIds.messageDisplaySubtitle}>
                        {response.hasOwnProperty('url') ? transkeys.shortURLSuccessMessage + response.url : transkeys.shortURLFailureMessage}
                    </Text>
                )}
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    {routeID === NAVIGATION_PARAM.ROUTE_TRACK_CONTENT && response.hasOwnProperty('url') === false && (
                        <Text style={styles.subtitleStyle} testID={testIds.messageDisplaySubtitle}>
                            {'Track Content Response --> ' + JSON.stringify(response)}
                        </Text>
                    )}
                    <Text style={styles.subtitleStyle} testID={testIds.serverLogs}>
                        {logsData}
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity onPress={(): void => onNextPress()} style={styles.buttonStyle} testID={testIds.messageDisplayBtnNext}>
                <Text style={styles.titleStyle}>{transkeys.nextButton}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default MessageDisplayComponent;
