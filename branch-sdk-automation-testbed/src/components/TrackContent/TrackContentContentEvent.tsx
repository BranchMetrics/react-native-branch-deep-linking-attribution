import { ROUTES, TRACK_CONTENT_TYPE, testIds } from '../constant/constant';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resources } from '../constant/colors';
import { styles } from '../../common/common.style';
import { transkeys } from '../translations/en';

const TrackContentContentEvent = (props: any) => {
    const { navigation, routeID } = props;
    const [alias, setAlias] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [additionalData, setAdditionalData] = React.useState('');

    const [eventDropDownOpen, setEventDropDownOpen] = useState(false);
    const [eventSelectedItem, setEventSelectedItem] = useState(null);
    const [eventArray, setEventArray] = useState(transkeys.trackContentContentData);

    const onPressSubmit = async (): Promise<void> => {
        if (eventSelectedItem != null) {
            let params = {
                alias: alias,
                description: description,
                searchQuery: searchQuery,
                custom_data: {
                    Custom_Event_Property_Key1: additionalData,
                },
            };
            navigation && navigation.replace(ROUTES.BRANCH_INPUT_SCREEN, { params: params, routeID: routeID, selectedEvent: eventSelectedItem, type: TRACK_CONTENT_TYPE.CONTENT });
        }
    };
    return (
        <KeyboardAwareScrollView style={styles.container} testID={testIds.scrollContainer}>
            <DropDownPicker
                placeholder="Select Event"
                open={eventDropDownOpen}
                value={eventSelectedItem}
                items={eventArray}
                setOpen={setEventDropDownOpen}
                setValue={setEventSelectedItem}
                setItems={setEventArray}
                listMode={'SCROLLVIEW'}
                containerStyle={styles.dropdownContainerTrackContent}
                zIndex={1000}
                testID={testIds.dropDownEventContent}
            />
            <TextInput
                style={styles.input}
                testID={testIds.inputAliasContent}
                onChangeText={(_text: string) => setAlias(_text)}
                value={alias}
                placeholder={transkeys.alias}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputDescriptionContent}
                style={styles.input}
                onChangeText={(_text: string) => setDescription(_text)}
                value={description}
                placeholder={transkeys.description}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputSearchQuery}
                style={styles.input}
                onChangeText={(_text: string) => setSearchQuery(_text)}
                value={searchQuery}
                placeholder={transkeys.searchQuery}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputAdditionalDataContent}
                style={styles.input}
                onChangeText={(_text: string) => setAdditionalData(_text)}
                value={additionalData}
                placeholder={transkeys.inputAdditionalData}
                placeholderTextColor={resources.color.black}
            />
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnSubmit} onPress={() => onPressSubmit()}>
                    <Text style={styles.titleStyle}>{transkeys.Submit}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default TrackContentContentEvent;
