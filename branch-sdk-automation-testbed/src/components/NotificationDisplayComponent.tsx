import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import WebView from 'react-native-webview';
import branch from 'react-native-branch';
import { resources } from './constant/colors';
import { testIds } from './constant/constant';
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
    scrollContainer: {
        flex: 1,
    },
});

const NotificationDisplayComponent = ({ navigation }) => {
    const route = useRoute();
    const { title, message } = route.params;
    const onNextPress = () => {
        navigation.goBack();
    };
    useEffect(() => {
        branch.subscribe({
            onOpenStart: ({ uri, cachedInitialEvent }) => {
                // cachedInitialEvent is true if the event was received by the
                // native layer before JS loaded.
                console.log('Branch will open ' + uri);
            },
            onOpenComplete: ({ error, params, uri }) => {
                if (error) {
                    console.error('Error from Branch opening uri ' + uri);
                    return;
                }

                console.log('Branch opened ' + uri);
                // handle params
            },
        });
    }, []);
    return (
        <View style={styles.mainContainer} testID={testIds.notificationDisplayContainer}>
            <Text style={styles.headerStyle} testID={testIds.notificationHeader}>
                {title}
            </Text>
            <Text style={styles.subtitleStyle} testID={testIds.notificationMessage}>
                {message}
            </Text>
            <ScrollView style={styles.scrollContainer}>
                <WebView
                    source={{
                        uri: message,
                    }}
                    style={{ marginTop: 20 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={false}
                    originWhitelist={['*']}
                />
            </ScrollView>
            <TouchableOpacity onPress={(): void => onNextPress()} style={styles.buttonStyle} testID={testIds.btnNextNotification}>
                <Text style={styles.titleStyle}>{transkeys.nextButton}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default NotificationDisplayComponent;
