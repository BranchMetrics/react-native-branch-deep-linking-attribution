import { StyleSheet, View } from 'react-native';

import React from 'react';
import { resources } from '../components/constant/colors';

export const Divider = () => {
    return <View style={styles.divider} />;
};
const styles = StyleSheet.create({
    divider: {
        borderBottomColor: resources.color.black,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20,
        marginTop: 5,
    },
});
