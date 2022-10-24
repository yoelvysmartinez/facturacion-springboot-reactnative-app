import React from 'react'
import { StyleSheet, View, Text } from 'react-native';

export const Tarjeta = ({ children }: any) => {
    return (
        <View style={styles.mainCardView}>
            <View>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainCardView: {
        backgroundColor: "white",
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 4,
        paddingHorizontal:10,
        paddingVertical: 10,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 8
    }
});