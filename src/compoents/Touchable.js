/**
 * Touchable
 */

import React from 'react';
import {
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native';

const Touchable = (props) => (
    __IOS__?
    <TouchableOpacity
        disabled={props.disabled}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        activeOpacity={.8} >
        <View style={props.style}>{props.children}</View>
    </TouchableOpacity>
    :
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