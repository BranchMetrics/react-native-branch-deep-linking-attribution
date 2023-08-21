import { ROUTES, TRACK_CONTENT_TYPE, testIds } from '../constant/constant';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { resources } from '../constant/colors';
import { styles } from '../../common/common.style';
import { transkeys } from '../translations/en';

const TrackContentCustomEvent = (props: any) => {
    const { navigation, routeID } = props;
    const [alias, setAlias] = React.useState('');
    const [customEventName, setCustomEventName] = React.useState('');
    const [customData1, setCustomData1] = React.useState('');
    const [customData2, setCustomData2] = React.useState('');

    const onPressSubmit = async (): Promise<void> => {
        let params = {
            alias: alias,
            custom_data: {
                Custom_Event_Property_Key1: customData1,
                Custom_Event_Property_Key2: customData1,
            },
        };
        navigation && navigation.replace(ROUTES.BRANCH_INPUT_SCREEN, { params: params, routeID: routeID, selectedEvent: customEventName, type: TRACK_CONTENT_TYPE.CUSTOM });
    };
    return (
        <ScrollView style={styles.container} testID={testIds.scrollContainer}>
            <KeyboardAwareScrollView style={styles.container}>
                <TextInput
                    style={styles.input}
                    testID={testIds.inputCustomEvent}
                    onChangeText={(_text: string) => setCustomEventName(_text)}
                    value={customEventName}
                    placeholder={transkeys.customEventName}
                    placeholderTextColor={resources.color.black}
                />

                <TextInput
                    style={styles.input}
                    testID={testIds.inputAliasCustomEvents}
                    onChangeText={(_text: string) => setAlias(_text)}
                    value={alias}
                    placeholder={transkeys.alias}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    style={styles.input}
                    testID={testIds.inputCustomData1}
                    onChangeText={(_text: string) => setCustomData1(_text)}
                    value={customData1}
                    placeholder={transkeys.customData1}
                    placeholderTextColor={resources.color.black}
                />
                <TextInput
                    testID={testIds.inputCustomData2}
                    style={styles.input}
                    onChangeText={(_text: string) => setCustomData2(_text)}
                    value={customData2}
                    placeholder={transkeys.customData2}
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
export default TrackContentCustomEvent;
