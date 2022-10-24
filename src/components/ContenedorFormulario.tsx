import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

export const ContenedorFormulario = ({ children }: any) => {
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={{ marginTop: 20 }}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
