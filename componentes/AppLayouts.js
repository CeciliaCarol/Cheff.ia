import React from "react";
import { View, StyleSheet,extraPaddingTop, ScrollView } from "react-native";
import Navbar from "./Navbar"; // Importando sua Navbar

const AppLayouts = ({ children, scrollable = false, hideNavbar = false, route }) => {
     // Define paddingTop: 0 para a Home, e 50 para as outras telas
     const paddingTop = route?.name === 'Home' ? 0 : 75;
     
    return (
        <View style={styles.container}>
            {/* Conteúdo principal */}
            {scrollable ? (
               <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop }]}>
               {children}
           </ScrollView>
            ) : (
                <View style={[styles.content, { paddingTop }]}>
                {children}
            </View>
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
        paddingTop:0, //esse
        paddingBottom: 100, 
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 100, 
        paddingTop: 50, 
    },
});

export default AppLayouts;
