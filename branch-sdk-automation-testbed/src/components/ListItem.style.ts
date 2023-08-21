import { StyleSheet } from 'react-native';
import { resources } from './constant/colors';

export const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 15,
        padding: 10,
        backgroundColor: resources.color.purple_700,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    titleStyle: {
        color: resources.color.white,
        fontWeight: '500',
    },
});
