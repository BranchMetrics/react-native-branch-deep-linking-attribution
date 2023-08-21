import { NAVIGATION_PARAM, ParamsType, testIds } from './constant/constant';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Divider } from '../common/Divider';
import { resources } from './constant/colors';
import { transkeys } from './translations/en';
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
    titleStyleBold: {
        color: resources.color.black,
        fontWeight: '500',
        marginRight: 5,
    },
    titleStyle: {
        color: resources.color.black,
        fontWeight: '400',
        marginLeft: 5,
        flexWrap: 'wrap',
        paddingRight: 5,
        flex: 1,
    },
    container: {
        backgroundColor: resources.color.white,
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    sourceContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        marginTop: 10,
    },
    jsonContainer: {
        marginTop: 10,
    },
    mainCardView: {
        backgroundColor: resources.color.white,
        borderRadius: 10,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        paddingLeft: 16,
        paddingRight: 14,
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 10,
        marginRight: 10,
        marginBottom : 50,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const ReadDeepLinkComponent = ({ navigation }) => {
    const route = useRoute();
    const routeID = route.params?.routeID;
    const getTitle = (): string => {
        switch (routeID) {
            case NAVIGATION_PARAM.ROUTE_READ_DEEP_LINK:
                return transkeys.readDeepLink;
            case NAVIGATION_PARAM.ROUTE_NAVIGATE_CONTENT:
                return transkeys.navigateToContent;
            case NAVIGATION_PARAM.ROUTE_HANDLE_DEEPLINK:
                return transkeys.handleLinkinApp;
        }
        return transkeys.readDeepLink;
    };

    useEffect(() => {
        navigation.setOptions({
            title: getTitle(),
        });
    }, []);

    const [params] = useState(route.params.params);
    const [installParams] = useState(route.params.installParams);
    const [lastParams] = useState(route.params.lastParams);
    const ReadTitle = (): JSX.Element => {
        if ((routeID === NAVIGATION_PARAM.ROUTE_NAVIGATE_CONTENT || routeID === NAVIGATION_PARAM.ROUTE_READ_DEEP_LINK) && Platform.OS == 'ios') {
            return (
                <View style={[styles.mainCardView, styles.item]}>
                    <Text style={styles.titleStyleBold} testID={testIds.txtSourceURL}>
                        {'Source URL : '}
                    </Text>
                    <Text style={styles.titleStyle}>{route.params?.sourceURL}</Text>
                </View>
            );
        }
        return <></>;
    };
    const ReadJson = (): JSX.Element => {
        var paramText = ParamsType.PARAMS + '--> ' + JSON.stringify(params) + '\n\n';
        var lastParamText = ParamsType.LAST_PARAMS + '--> ' + JSON.stringify(lastParams) + '\n\n';
        var installParamtext = ParamsType.INSTALL_PARAMS + '--> ' + JSON.stringify(installParams) + '\n\n';
        let text = '';
        if (routeID === NAVIGATION_PARAM.ROUTE_NAVIGATE_CONTENT || routeID === NAVIGATION_PARAM.ROUTE_HANDLE_DEEPLINK) {
            text = paramText;
        } else if (routeID === NAVIGATION_PARAM.ROUTE_READ_DEEP_LINK) {
            text = paramText + lastParamText + installParamtext;
        }
        paramText + lastParamText + installParamtext;
        return (
            <View style={styles.jsonContainer}>
                <View style={styles.centerContainer}>
                    <Text style={styles.titleStyleBold} testID={testIds.txtSdkParams}>
                        {text}
                    </Text>
                </View>

                <Divider />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} testID={testIds.readDeepLinkContainer}>
            <ReadTitle />
            <View style={[styles.mainCardView, { flexDirection: 'column' }]}>
                <ReadJson />
            </View>
        </ScrollView>
    );
};
export default ReadDeepLinkComponent;
