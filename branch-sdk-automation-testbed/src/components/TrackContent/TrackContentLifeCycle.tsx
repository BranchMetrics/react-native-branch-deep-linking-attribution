import { ROUTES, TRACK_CONTENT_TYPE, testIds } from '../constant/constant';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resources } from '../constant/colors';
import { styles } from '../../common/common.style';
import { transkeys } from '../translations/en';

const TrackContentLifeCycle = (props: any) => {
    const { navigation, routeID } = props;
    const [transactionID, setTransactionID] = React.useState('');
    const [alias, setAlias] = React.useState('');

    const [description, setDescription] = React.useState('');
    const [registrationID, setRegistrationID] = React.useState('');
    const [customEventProperty1, setCustomEventProperty1] = React.useState('');
    const [customEventProperty2, setCustomEventProperty2] = React.useState('');

    const [eventDropDownOpen, setEventDropDownOpen] = useState(false);
    const [eventSelectedItem, setEventSelectedItem] = useState(null);
    const [eventArray, setEventArray] = useState(transkeys.trackContentLifeCycleEvents);

    const onPressSubmit = async (): Promise<void> => {
        if (eventSelectedItem != null) {
            let params = {
                alias: alias,
                transaction_id: transactionID,
                description: description,
                registration_id: registrationID,
                custom_data: {
                    Custom_Event_Property_Key1: customEventProperty1,
                    Custom_Event_Property_Key2: customEventProperty2,
                },
            };
            navigation && navigation.replace(ROUTES.BRANCH_INPUT_SCREEN, { params: params, routeID: routeID, selectedEvent: eventSelectedItem, type: TRACK_CONTENT_TYPE.CONTENT });
        }
    };
    return (
        <ScrollView style={styles.container} testID={testIds.scrollContainer}>
            <KeyboardAwareScrollView style={styles.container}>
                <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
                    <DropDownPicker
                        placeholder="Select Event"
                        open={eventDropDownOpen}
                        value={eventSelectedItem}
                        items={eventArray}
                        setOpen={setEventDropDownOpen}
                        setValue={setEventSelectedItem}
                        setItems={setEventArray}
                        style={{ height: 40 }}
                        listMode={'SCROLLVIEW'}
                        testID={testIds.dropDownEventLifeCycle}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    testID={testIds.inputAliasLifeCycle}
                    onChangeText={(_text: string) => setAlias(_text)}
                    value={alias}
                    placeholder={transkeys.alias}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    style={styles.input}
                    testID={testIds.inputTransactionIdLyfeCycle}
                    onChangeText={(_text: string) => setTransactionID(_text)}
                    value={transactionID}
                    placeholder={transkeys.transaction_id}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputDescriptionLifeCycle}
                    style={styles.input}
                    onChangeText={(_text: string) => setDescription(_text)}
                    value={description}
                    placeholder={transkeys.description}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputRegistrationID}
                    style={styles.input}
                    onChangeText={(_text: string) => setRegistrationID(_text)}
                    value={registrationID}
                    placeholder={transkeys.registrationID}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputCustomEventProperty1}
                    style={styles.input}
                    onChangeText={(_text: string) => setCustomEventProperty1(_text)}
                    value={customEventProperty1}
                    placeholder={transkeys.customEventProperty1}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputCustomEventProperty2}
                    style={styles.input}
                    onChangeText={(_text: string) => setCustomEventProperty2(_text)}
                    value={customEventProperty2}
                    placeholder={transkeys.customEventProperty2}
                    placeholderTextColor={resources.color.black}
                />
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnSubmit} onPress={() => onPressSubmit()}>
                        <Text style={styles.titleStyle}>{transkeys.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </ScrollView>
    );
};

export default TrackContentLifeCycle;
