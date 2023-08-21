import { BRANCH_LIST_DATA, ROUTES, displayContent, testIds } from './constant/constant';
import { FlatList, NativeModules, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { Item, ListItem } from './ListItem';
import React, { useEffect, useState } from 'react';

import { AppConfig } from '../common/AppConfig';
import branch from 'react-native-branch';
import { resources } from './constant/colors';

let appConfig: AppConfig = AppConfig.getInstance();

export const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    titleStyle: {
        color: resources.color.black,
        fontWeight: '500',
        marginRight: 10,
    },
    mainContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: resources.color.white,
    },
});
const { ReadLogs } = NativeModules;

const BranchNavigationScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
    };
    useEffect(() => {
        branch.disableTracking(isEnabled);
    }, [isEnabled]);

    const inserObject = () => {
        const exists = BRANCH_LIST_DATA.find((item) => item.id === displayContent.id);
        if (exists) {
            return;
        }
        BRANCH_LIST_DATA.splice(6, 0, displayContent);
    };

    useEffect(() => {
        if (typeof branch.isTrackingDisabled === Boolean) {
            setIsEnabled(branch.isTrackingDisabled);
        }
        Platform.OS === 'ios' && inserObject();
    }, []);

    const onListItemPress = (item: Item) => {
        ReadLogs.clearLogs();
        appConfig.clearMetaData();
        if (item.testId === testIds.btnTrackContent) {
            navigation &&
                navigation.navigate(ROUTES.TRACK_CONTENT, {
                    routeID: item.id,
                });
        } else if (item.testId === testIds.btnTrackUsers) {
        } else {
            navigation &&
                navigation.navigate(ROUTES.BRANCH_INPUT_SCREEN, {
                    routeID: item.id,
                });
        }
    };
    return (
        <View style={styles.mainContainer}>
            <FlatList
                style={{ flexGrow: 0 }}
                data={BRANCH_LIST_DATA}
                renderItem={({ item }) => <ListItem item={item} onListItemPress={onListItemPress} />}
                keyExtractor={(item: any) => item.id}
            />
            <View style={styles.footerContainer}>
                <Text style={styles.titleStyle}>{isEnabled ? 'Tracking Enabled' : 'Tracking Disabled'}</Text>
                <Switch
                    trackColor={{ false: resources.color.grey, true: resources.color.purple_700 }}
                    thumbColor={isEnabled ? resources.color.white : resources.color.teal_200}
                    ios_backgroundColor={resources.color.grey}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    testID={testIds.btnEnableTracking}
                />
            </View>
        </View>
    );
};
export default BranchNavigationScreen;
