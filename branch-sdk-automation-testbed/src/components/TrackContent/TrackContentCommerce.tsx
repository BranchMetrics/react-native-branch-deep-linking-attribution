import { ROUTES, TRACK_CONTENT_TYPE, testIds } from '../constant/constant';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resources } from '../constant/colors';
import { styles } from '../../common/common.style';
import { transkeys } from '../translations/en';

const TrackContentCommerce = (props: any) => {
    const { navigation, routeID } = props;
    const [transactionID, setTransactionID] = React.useState('');
    // const [alias, setAlias] = React.useState('');
    const [revenue, setRevenue] = React.useState('');
    const [shipping, setShipping] = React.useState('');
    const [tax, setTax] = React.useState('');
    const [coupan, setCoupan] = React.useState('');
    const [affiliation, setAffiliation] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [purchase_loc, setPurchaseLoc] = React.useState('');
    const [additionalData, setAdditionalData] = React.useState('');

    const [currentcyDropDownOpen, setcurrentcyDropDownOpen] = useState(false);
    const [currencyListSelectedItem, setCurrencyListSelectedItem] = useState(null);
    const [currencyArray, setCurrencyArray] = useState(transkeys.CurrencyList);

    const [eventDropDownOpen, setEventDropDownOpen] = useState(false);
    const [eventSelectedItem, setEventSelectedItem] = useState(null);
    const [eventArray, setEventArray] = useState(transkeys.trackContentDataCommerce);

    const [storePickupDropDownOpen, setStorePickupDropDownOpen] = useState(false);
    const [storePickupSelectedItem, setStorePickupSelectedItem] = useState(null);
    const [storePickupArray, setStorePickupArray] = useState(transkeys.availableList);

    const onPressSubmit = async (): Promise<void> => {
        if (eventSelectedItem != null) {
            let params = {
                transaction_id: transactionID,
                currency: currencyListSelectedItem == null ? '' : currencyListSelectedItem,
                revenue: revenue,
                shipping: shipping,
                tax: tax,
                coupon: coupan,
                affiliation: affiliation,
                description: description,
                purchase_loc: purchase_loc,
                store_pickup: storePickupSelectedItem == null ? '' : storePickupSelectedItem,
                custom_data: {
                    Custom_Event_Property_Key1: additionalData,
                },
            };
            navigation && navigation.replace(ROUTES.BRANCH_INPUT_SCREEN, { params: params, routeID: routeID, selectedEvent: eventSelectedItem, type: TRACK_CONTENT_TYPE.COMMERCE });
        }
    };
    return (
        <KeyboardAwareScrollView style={styles.container} testID={testIds.scrollContainer}>
            <DropDownPicker
                placeholder="Select Event"
                open={eventDropDownOpen}
                value={eventSelectedItem}
                containerStyle={styles.dropdownContainerTrackContent}
                items={eventArray}
                setOpen={setEventDropDownOpen}
                setValue={setEventSelectedItem}
                setItems={setEventArray}
                zIndex={1000}
                testID={testIds.dropDownEvent}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                onOpen={() => setcurrentcyDropDownOpen(false)}
            />
            {/* <TextInput
                style={styles.input}
                testID={testIds.inputAlias}
                onChangeText={(_text: string) => setAlias(_text)}
                value={alias}
                placeholder={transkeys.alias}
                placeholderTextColor={resources.color.black}
            /> */}
            <TextInput
                style={styles.input}
                testID={testIds.inputTransaction_id}
                onChangeText={(_text: string) => setTransactionID(_text)}
                value={transactionID}
                placeholder={transkeys.transaction_id}
                placeholderTextColor={resources.color.black}
            />

            <DropDownPicker
                placeholder="Select Currency"
                open={currentcyDropDownOpen}
                value={currencyListSelectedItem}
                items={currencyArray}
                containerStyle={styles.dropdownContainerTrackContent}
                zIndex={500}
                setOpen={setcurrentcyDropDownOpen}
                setValue={setCurrencyListSelectedItem}
                setItems={setCurrencyArray}
                style={{ height: 40 }}
                listMode={'SCROLLVIEW'}
                testID={testIds.dropDownCurrency}
            />

            <TextInput
                style={styles.input}
                testID={testIds.inputRevenue}
                keyboardType={'number-pad'}
                onChangeText={(_text: string) => setRevenue(_text)}
                value={revenue}
                placeholder={transkeys.revenue}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputShipping}
                style={styles.input}
                onChangeText={(_text: string) => setShipping(_text)}
                value={shipping}
                placeholder={transkeys.shipping}
                keyboardType={'number-pad'}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputTax}
                style={styles.input}
                keyboardType={'number-pad'}
                onChangeText={(_text: string) => setTax(_text)}
                value={tax}
                placeholder={transkeys.tax}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputCoupan}
                style={styles.input}
                onChangeText={(_text: string) => setCoupan(_text)}
                value={coupan}
                placeholder={transkeys.coupon}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputAffiliation}
                style={styles.input}
                onChangeText={(_text: string) => setAffiliation(_text)}
                value={affiliation}
                placeholder={transkeys.affiliation}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputDescription}
                style={styles.input}
                onChangeText={(_text: string) => setDescription(_text)}
                value={description}
                placeholder={transkeys.description}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputPurchase_loc}
                style={styles.input}
                onChangeText={(_text: string) => setPurchaseLoc(_text)}
                value={purchase_loc}
                placeholder={transkeys.purchase_loc}
                placeholderTextColor={resources.color.black}
            />

            <DropDownPicker
                placeholder="Select Availability"
                open={storePickupDropDownOpen}
                value={storePickupSelectedItem}
                items={storePickupArray}
                setOpen={setStorePickupDropDownOpen}
                setValue={setStorePickupSelectedItem}
                setItems={setStorePickupArray}
                containerStyle={styles.dropdownContainerTrackContent}
                zIndex={100}
                listMode={'SCROLLVIEW'}
                testID={testIds.dropdownAvailability}
            />
            <TextInput
                testID={testIds.inputAdditionalData}
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

export default TrackContentCommerce;
