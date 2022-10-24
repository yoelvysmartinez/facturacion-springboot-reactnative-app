import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    onPress: () => void,
    iconName: any
}

export const HeaderBotonMenu = ({ onPress, iconName }: Props) => {
    return (
        <TouchableOpacity style={{

            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            zIndex: 1
        }}
            onPress={onPress}
        >
            <Icon size={30} color='white' name={iconName} />
        </TouchableOpacity>
    )
}
