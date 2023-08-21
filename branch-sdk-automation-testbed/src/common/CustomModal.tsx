import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import { resources } from '../components/constant/colors';
import { testIds } from '../components/constant/constant';
import { transkeys } from '../components/translations/en';

interface Props {
    modalVisible: boolean;
    onCloseModal: CallableFunction;
    title: string;
    subtitle: string;
}
export const CustomModal = (props: Props) => {
    const { modalVisible, onCloseModal, title, subtitle } = props;
    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => onCloseModal} style={styles.modalContent} testID={testIds.modalContainer}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle} testID={testIds.modalTitle}>
                        {title}
                    </Text>
                    <View style={styles.divider} testID={testIds.modalDivider} />
                    <Text style={styles.modalSubtitle} testID={testIds.modalSubtitle}>
                        {subtitle}
                    </Text>

                    <View style={styles.footer}>
                        <TouchableOpacity testID={testIds.modalContainer} accessible={false} style={[styles.button, styles.buttonOpen]} onPress={() => onCloseModal()}>
                            <Text style={styles.textStyle}>{transkeys.okay}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: resources.color.white,
        borderRadius: 20,
        paddingTop: 15,
        paddingBottom: 20,
        width: Dimensions.get('window').width - 20,
        shadowColor: resources.color.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: resources.color.purple_700,
        marginTop: 10,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 24,
        color: resources.color.purple_700,
    },
    modalSubtitle: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16,
        color: resources.color.black,
    },
    divider: {
        borderBottomColor: resources.color.grey,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    footer: {
        marginTop: 50,
        marginLeft: 15,
        marginRight: 15,
    },
});
