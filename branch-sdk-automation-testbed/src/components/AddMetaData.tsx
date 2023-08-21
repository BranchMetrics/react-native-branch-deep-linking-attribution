import { ContentMetadata, testIds } from './constant/constant';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';

import { AppConfig } from './../common/AppConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { resources } from './constant/colors';
import { styles } from '../common/common.style';
import { transkeys } from './translations/en';

let appConfig: AppConfig = AppConfig.getInstance();
const AddMetaData = ({ navigation }) => {
    const [metaData, setMetadata] = useState(ContentMetadata);
    const [supplyValueDropDownOpen, setSupplyValueDropDownOpen] = useState(false);
    const [supplyValueSelectedItem, setSupplyValueSelectedItem] = useState(null);
    const [itemsSupplyArray, setItemsSupplyArray] = useState(transkeys.supplyArray);

    const [productConditionDropdownOpen, setProductConditionDropdownOpen] = useState(false);
    const [productConditionSelectedItem, setProductConditionSelectedItem] = useState(null);
    const [itemsProductConditionArray, setItemsProductConditionArray] = useState(transkeys.productCondition);

    const [currencyDropDownOpen, setCurrencyDropDownOpen] = useState(false);
    const [currencyDropDownSelectedItem, setCurrencyDropDownSelectedItem] = useState(null);
    const [currencyDropDownArray, setCurrencyDropDownArray] = useState(transkeys.CurrencyList);

    const [contentSchemaDropDownOpen, setContentSchemaDropDownOpen] = useState(false);
    const [contentSchemaSelectedItem, setContentSchemaSelectedItem] = useState(null);
    const [contentSchemaArray, setContentSchemaArray] = useState(transkeys.contentSchema);

    const onPressSubmit = async (): Promise<void> => {
        appConfig.addMetaDataObject(metaData);
        navigation.goBack();
    };
    const onChangeText = (text: any, field: string) => {
        setMetadata((state) => ({ ...state, [field]: text }));
    };
    const onChangeImage = (text: string, field: string) => {
        setMetadata((state) => ({ ...state, [field]: text }));
    };
    return (
        <KeyboardAwareScrollView style={styles.container} testID={testIds.scrollContainer}>
            <TextInput
                style={styles.input}
                testID={testIds.inputProductName}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$product_name)}
                value={metaData.$product_name}
                autoFocus={true}
                placeholder={transkeys.productName}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputProductBrand}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$product_brand)}
                value={metaData.$product_brand}
                placeholder={transkeys.productBrand}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                style={styles.input}
                testID={testIds.inputProductVariant}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$product_variant)}
                value={metaData.$product_variant}
                placeholder={transkeys.productVariant}
                placeholderTextColor={resources.color.black}
            />
            <DropDownPicker
                placeholder="Select Supply Value"
                open={supplyValueDropDownOpen}
                value={supplyValueSelectedItem}
                items={itemsSupplyArray}
                setOpen={setSupplyValueDropDownOpen}
                setValue={setSupplyValueSelectedItem}
                onOpen={() => setProductConditionDropdownOpen(false)}
                setItems={setItemsSupplyArray}
                style={styles.dropDownContainer}
                zIndex={1000}
                testID={testIds.dropdownSupplyValue}
                listMode={'SCROLLVIEW'}
                onChangeValue={(_text: string) => {
                    onChangeText(_text, transkeys.$product_category);
                }}
            />

            <DropDownPicker
                placeholder="Select Product Condition"
                open={productConditionDropdownOpen}
                value={productConditionSelectedItem}
                items={itemsProductConditionArray}
                onOpen={() => setSupplyValueDropDownOpen(false)}
                setOpen={setProductConditionDropdownOpen}
                setValue={setProductConditionSelectedItem}
                setItems={setItemsProductConditionArray}
                style={styles.dropDownContainer}
                zIndex={600}
                listMode={'SCROLLVIEW'}
                testID={testIds.dropDownProductCondition}
                onChangeValue={(_text: string) => {
                    onChangeText(_text, transkeys.$condition);
                }}
            />
            <TextInput
                testID={testIds.inputStreet}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$address_street)}
                value={metaData.$address_street}
                placeholder={transkeys.Street}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputCity}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$address_city)}
                value={metaData.$address_city}
                placeholder={transkeys.City}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputRegion}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$address_region)}
                value={metaData.$address_region}
                placeholder={transkeys.Region}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputCountry}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$address_country)}
                value={metaData.$address_country}
                placeholder={transkeys.Country}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputPostalCode}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$address_postal_code)}
                value={metaData.$address_postal_code}
                placeholder={transkeys.postalCode}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputLattitude}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$latitude)}
                value={metaData.$latitude}
                placeholder={transkeys.Latitude}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputLongitude}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$longitude)}
                value={metaData.$longitude}
                placeholder={transkeys.Longitude}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputSKU}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$sku)}
                value={metaData.$sku}
                placeholder={transkeys.Sku}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputRatting}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$rating)}
                value={metaData.$rating}
                keyboardType={'number-pad'}
                placeholder={transkeys.Rating}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputAverageRating}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$rating_average)}
                value={metaData.$rating_average}
                keyboardType={'number-pad'}
                placeholder={transkeys.AverageRating}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputMaxRatting}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$rating_max)}
                value={metaData.$rating_max}
                keyboardType={'number-pad'}
                placeholderTextColor={resources.color.black}
                placeholder={transkeys.MaximumRating}
            />
            <TextInput
                testID={testIds.inputRattingCount}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$rating_count)}
                value={metaData.$rating_count}
                keyboardType={'number-pad'}
                placeholder={transkeys.RatingCount}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputImageCaptions}
                style={styles.input}
                onChangeText={(_text: string) => onChangeImage(_text, transkeys.$image_captions)}
                value={metaData.$image_captions}
                placeholder={transkeys.ImageCaption}
                placeholderTextColor={resources.color.black}
            />
            <TextInput
                testID={testIds.inputQuantity}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$quantity)}
                value={metaData.$quantity}
                keyboardType={'number-pad'}
                placeholder={transkeys.Quantity}
                placeholderTextColor={resources.color.black}
            />
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    testID={testIds.inputPrice}
                    style={[styles.input, { width: Dimensions.get('screen').width / 2 - 20, marginRight: 5 }]}
                    onChangeText={(_text: string) => onChangeText(_text, transkeys.$price)}
                    value={metaData.$price}
                    keyboardType={'number-pad'}
                    placeholder={transkeys.Price}
                    placeholderTextColor={resources.color.black}
                />
                <DropDownPicker
                    containerStyle={{ width: Dimensions.get('screen').width / 2 - 20, marginLeft: 20 }}
                    placeholder="Select Currency"
                    open={currencyDropDownOpen}
                    onOpen={() => setContentSchemaDropDownOpen(false)}
                    value={currencyDropDownSelectedItem}
                    items={currencyDropDownArray}
                    setOpen={setCurrencyDropDownOpen}
                    setValue={setCurrencyDropDownSelectedItem}
                    setItems={setCurrencyDropDownArray}
                    style={styles.dropDownContainer}
                    testID={testIds.dropDownCurrency}
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                        nestedScrollEnabled: true,
                    }}
                    onChangeValue={(_text: string) => {
                        onChangeText(_text, transkeys.$currency);
                        setContentSchemaDropDownOpen(false);
                    }}
                    closeAfterSelecting={true}
                />
                {/* </View> */}
            </View>

            <DropDownPicker
                placeholder="Select Content Schemea"
                open={contentSchemaDropDownOpen}
                value={contentSchemaSelectedItem}
                items={contentSchemaArray}
                setOpen={setContentSchemaDropDownOpen}
                onOpen={() => setCurrencyDropDownOpen(false)}
                setValue={setContentSchemaSelectedItem}
                setItems={setContentSchemaArray}
                style={styles.dropDownContainer}
                listMode="SCROLLVIEW"
                testID={testIds.dropDownContentSchema}
                zIndex={50}
                onChangeValue={(_text: string) => {
                    onChangeText(_text, transkeys.$content_schema);
                    setCurrencyDropDownOpen(false);
                }}
                closeAfterSelecting={true}
            />
            <TextInput
                testID={testIds.inputCustomMetadata}
                style={styles.input}
                onChangeText={(_text: string) => onChangeText(_text, transkeys.$Custom_Content_metadata_key1)}
                value={metaData.Custom_Content_metadata_key1}
                placeholder={transkeys.CustomMetadata}
                placeholderTextColor={resources.color.black}
            />
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.buttonStyle} testID={testIds.btnSubmit} onPress={(): Promise<void> => onPressSubmit()}>
                    <Text style={styles.titleStyle}>{transkeys.Submit}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default AddMetaData;
