/**
 * Touchable
 */

import React from 'react';
import {
    TouchableNativeFeedback,
    View,
} from 'react-native';

const Touchable = (props) => (
    <TouchableNativeFeedback
        delayPressIn={50}
        disabled={props.disabled}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        background={TouchableNativeFeedback.SelectableBackground()} >
        <View style={props.style}>{props.children}</View>
    </TouchableNativeFeedback>
)

export default Touchable;