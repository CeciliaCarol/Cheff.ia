import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

const AppLayouts = ({ children, scrollable = false }) => {
    return scrollable ? (
        <ScrollView contentContainerStyle={Styles.scrollContainer}>
            {children}
        </ScrollView>
        ) : (
        <View Style={Styles.container}>{children}</View>
        );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#FFFFFF', // Cor de fundo da tela
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingRight: 30,
        paddingBottom: 20,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
    },
});

export default AppLayouts;