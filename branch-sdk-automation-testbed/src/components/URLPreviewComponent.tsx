import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NAVIGATION_PARAM, testIds } from './constant/constant';
import React, { useState } from 'react';

import { WebView } from 'react-native-webview';
import { handleLink } from '../helper/BranchHelper';
import { resources } from './constant/colors';
import { useRoute } from '@react-navigation/native';

export const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 50,
        padding: 10,
        backgroundColor: resources.color.purple_700,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    titleStyle: {
        color: resources.color.white,
        fontWeight: '500',
    },
    textStyle: {
        color: resources.color.black,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: resources.color.white,
        paddingTop: 20,
    },
});

const URLPreviewComponent = ({navigation}) => {
    const route = useRoute();
    const [routeURL, setRouteURL] = useState('');

    const onOpenLink = (): void => {
        handleLink(route.params?.url);
    };
    const onNext = (): void => {
        navigation.goBack();
    };
    return (
        <View style={styles.container} testID={testIds.webviewContainer}>
            <Text testID={testIds.textShortURL} style={styles.textStyle}>{'Short URL : ' + route.params?.url}</Text>
            {route.params.routeID === NAVIGATION_PARAM.ROUTE_CREATE_DEEP_LINK && (
                <Text testID={testIds.textLongURL} style={{ color: 'blue' }} onPress={() => Linking.openURL(routeURL)}>
                    {routeURL}
                </Text>
            )}
            {route.params?.routeID === NAVIGATION_PARAM.ROUTE_READ_DEEP_LINK && (
                <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnOpenLink} onPress={(): void => onOpenLink()}>
                    <Text style={styles.titleStyle}>{'Read Deep Link'}</Text>
                </TouchableOpacity>
            )}
            {route.params?.routeID === NAVIGATION_PARAM.ROUTE_NAVIGATE_CONTENT && (
                <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnNavigateLink} onPress={(): void => onOpenLink()}>
                    <Text style={styles.titleStyle}>{'Navigate To Content'}</Text>
                </TouchableOpacity>
            )}
            {route.params?.routeID === NAVIGATION_PARAM.ROUTES_CREATE_CONTENT_REFERENCE && (
                <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnNavigateLink} onPress={(): void => onNext()}>
                    <Text style={styles.titleStyle}>{'Next'}</Text>
                </TouchableOpacity>
            )}
            {route.params.routeID === NAVIGATION_PARAM.ROUTE_CREATE_DEEP_LINK && (
                <WebView
                    source={{
                        uri: route.params?.url,
                    }}
                    style={{ marginTop: 20 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={false}
                    onNavigationStateChange={(navState) => {
                        setRouteURL(navState.url);
                    }}
                    originWhitelist={['*']}
                />
            )}
        </View>
    );
};
export default URLPreviewComponent;
