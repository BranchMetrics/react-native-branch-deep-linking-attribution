import * as React from 'react';

import { NativeModules, StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

import TrackContentCommerce from './TrackContentCommerce';
import TrackContentContentEvent from './TrackContentContentEvent';
import TrackContentCustomEvent from './TrackContentCustomEvent';
import TrackContentLifeCycle from './TrackContentLifeCycle';
import { resources } from '../constant/colors';
import { useRoute } from '@react-navigation/native';

const { ReadLogs } = NativeModules;
const styles = StyleSheet.create({
    tabBar: { backgroundColor: resources.color.purple_700 },
    label: { fontSize: 10 },
    indicator: { backgroundColor: '#ffffff' },
});
const renderTabBar = (props: any) => <TabBar {...props} indicatorStyle={styles.indicator} style={styles.tabBar} labelStyle={styles.label} />;

export default function TrackContentTab({ navigation }) {
    const routeMain = useRoute();
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'Commerce':
                return <TrackContentCommerce navigation={navigation} routeID={routeMain.params?.routeID} />;
            case 'Content':
                return <TrackContentContentEvent navigation={navigation} routeID={routeMain.params?.routeID} />;
            case 'Lifecycle':
                return <TrackContentLifeCycle navigation={navigation} routeID={routeMain.params?.routeID} />;
            case 'Custom':
                return <TrackContentCustomEvent navigation={navigation} routeID={routeMain.params?.routeID} />;
            default:
                return null;
        }
    };
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Commerce', title: 'Commerce' },
        { key: 'Content', title: 'Content' },
        { key: 'Lifecycle', title: 'Lifecycle' },
        { key: 'Custom', title: 'Custom' },
    ]);

    return <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} renderTabBar={renderTabBar} />;
}
