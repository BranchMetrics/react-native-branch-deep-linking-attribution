import { Text, TouchableOpacity } from 'react-native';

import React from 'react';
import { styles } from './ListItem.style';

export interface Props {
    item: Item;
    onListItemPress: CallableFunction;
}

export interface Item {
    id: string;
    name: string;
    testId: string;
}
export const ListItem = (props: Props) => {
    const { id, name, testId } = props.item;
    const { onListItemPress } = props;
    return (
        <TouchableOpacity style={styles.buttonStyle} testID={testId} key={id} onPress={(): void => onListItemPress(props.item)}>
            <Text style={styles.titleStyle}>{name}</Text>
        </TouchableOpacity>
    );
};
