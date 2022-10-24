import React from 'react'
import { Dimensions, Image, View } from 'react-native';

export const Logo = () => {
    const { height, width } = Dimensions.get('window');
    const dim = width * 0.30
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <Image
                source={require('../assets/logo.png')}
                style={{
                    width: dim,
                    height: dim,
                }}
            />
        </View>
    )
}
