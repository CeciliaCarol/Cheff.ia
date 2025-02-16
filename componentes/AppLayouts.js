import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Navbar from "./Navbar"; // Importando sua Navbar

const AppLayouts = ({ children, scrollable = false, hideNavbar = false }) => {
    return (
        <View style={styles.container}>
            {/* Conteúdo principal */}
            {scrollable ? (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {children}
                </ScrollView>
            ) : (
                <View style={styles.content}>{children}</View>
            )}

            {/* Exibe a Navbar apenas se `hideNavbar` for `false` */}
            {!hideNavbar && <Navbar />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        paddingTop:0,
        paddingBottom: 100, 
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 100, 
    },
});

export default AppLayouts;
