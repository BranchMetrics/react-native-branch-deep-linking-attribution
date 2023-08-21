import { StyleSheet } from 'react-native';
import { resources } from '../components/constant/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5,
        paddingBottom: 50,
    },
    input: {
        height: 40,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 4,
        marginTop: 10,
        color: resources.color.black,
    },
    dropDownContainer: {
        marginTop: 10,
    },
    buttonStyle: {
        marginTop: 15,
        padding: 10,
        backgroundColor: resources.color.purple_700,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        minWidth: 150,
    },
    titleStyle: {
        color: resources.color.white,
        fontWeight: '500',
    },
    dropdownContainer: {
        flexDirection: 'row',
        zIndex: 500,
        flex: 1,
        marginTop: 12,
        marginBottom: 12,
    },
    dropdownContainerTrackContent: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 12,
        marginBottom: 12,
    },
    footerContainer: { flex: 1, marginLeft: 12, marginRight: 12, marginBottom: 50 },
});
