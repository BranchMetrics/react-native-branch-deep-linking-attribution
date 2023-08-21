/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NAVIGATION_PARAM, ROUTES } from './src/components/constant/constant';
import React, { useEffect } from 'react';
import { navigationRef, replace } from './src/utils/ RootNavigation';

import AddMetaData from './src/components/AddMetaData';
import BranchGenerateURL from './src/components/BranchGenerateURL';
import BranchInputComponent from './src/components/BranchInputComponent';
import BranchNavigationScreen from './src/components/BranchNavigationScreen';
import MessageDisplayComponent from './src/components/MessageDisplayComponent';
import { NavigationContainer } from '@react-navigation/native';
import NotificationDisplayComponent from './src/components/NotificationDisplayComponent';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ReadDeepLinkComponent from './src/components/ReadDeepLinkComponent';
import TrackContentTab from './src/components/TrackContent/TrackContentTab';
import URLPreviewComponent from './src/components/URLPreviewComponent';
import branch from 'react-native-branch';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { readDeepLink } from './src/helper/BranchHelper';
import { transkeys } from './src/components/translations/en';

const Stack = createNativeStackNavigator();

const App = () => {
    PushNotification.configure({
        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
            navigationRef.navigate(ROUTES.NOTIFICATION_DETAILS, {
                title: notification.title,
                message: notification.message,
            });
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        requestPermissions: Platform.OS === 'ios',
    });

    const onHandleNavigate = (params: any, uri: any) => {
        if (
            navigationRef.current?.getCurrentRoute() === undefined ||
            navigationRef.current?.getCurrentRoute().params === undefined ||
            navigationRef.current?.getCurrentRoute().params.routeID === undefined
        ) {
            return;
        }
        const currentRoute = navigationRef.current?.getCurrentRoute().params.routeID;
        const clickedURL = navigationRef.current?.getCurrentRoute().params.url;

        // params will never be null if error is null
        if (currentRoute === NAVIGATION_PARAM.ROUTE_READ_DEEP_LINK) {
            readDeepLink().then((object) => {
                replace(ROUTES.READ_DEEP_LINK, {
                    routeID: currentRoute,
                    params: params,
                    lastParams: object.lastParams,
                    installParams: object.installParams,
                    sourceURL: clickedURL,
                    deepLinkURL: uri,
                });
            });
            return;
        }
        if (params['+non_branch_link']) {
            const nonBranchUrl = params['+non_branch_link'];
            // Route non-Branch URL if appropriate.
            return;
        }

        if (params['+clicked_branch_link']) {
            // A Branch link opened.
            // Route link based on data in params
            replace(ROUTES.READ_DEEP_LINK, {
                routeID: currentRoute,
                params: params,
                lastParams: {},
                installParams: {},
                sourceURL: clickedURL,
                deepLinkURL: uri,
            });
            return;
        }
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

    useEffect(() => {
        const unsubscribe = branch.subscribe(({ error, params, uri }) => {
            if (error) {
                console.error('Error from Branch: ' + error);
                return;
            }
            if (!params['+clicked_branch_link'] && !params['+non_branch_link']) {
                // this is one of those responses you can ignore
                return;
            }
            // console.log('params non_branch_link', params?.['+non_branch_link']);
            onHandleNavigate(params, uri);
        });
        return () => unsubscribe();
    }, []);
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen
                    name={ROUTES.BRANCH_LIST_SCREEN}
                    component={BranchNavigationScreen}
                    options={{
                        title: transkeys.branchSDKTest,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.BRANCH_INPUT_SCREEN}
                    component={BranchInputComponent}
                    options={{
                        title: transkeys.createBuo,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.BRANCH_GENERATE_URL}
                    component={BranchGenerateURL}
                    options={{
                        title: transkeys.generateURL,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.LOG_DISPLAY}
                    component={URLPreviewComponent}
                    options={{
                        title: transkeys.generateURL,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.MESSAGE_DISPLAY}
                    component={MessageDisplayComponent}
                    options={{
                        title: transkeys.generateURL,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.ADD_META_DATA}
                    component={AddMetaData}
                    options={{
                        title: transkeys.AddMetaData,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.READ_DEEP_LINK}
                    component={ReadDeepLinkComponent}
                    options={{
                        title: transkeys.readDeepLink,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.NOTIFICATION_DETAILS}
                    component={NotificationDisplayComponent}
                    options={{
                        title: transkeys.notification,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.TRACK_CONTENT}
                    component={TrackContentTab}
                    options={{
                        title: transkeys.trackContent,
                    }}
                />
                <Stack.Screen
                    name={ROUTES.TRACK_CONTENT_EVENTS}
                    component={TrackContentTab}
                    options={{
                        title: transkeys.trackContent,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
