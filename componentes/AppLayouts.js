import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Navbar from "./Navbar"; // Importando sua Navbar

const AppLayouts = ({ children, scrollable = false, hideNavbar = false, route }) => {
     // Define paddingTop: 0 para a Home, e 50 para as outras telas
     
     
    return (
        <View style={styles.container}>
            {/* Conteúdo principal */}
            {scrollable ? (
               <ScrollView Style={[styles.scrollContainer]}>
               {children}
           </ScrollView>
            ) : (
                <View style={[styles.content]}>
                {children}
            </View>
            )}

            {/* Exibe a Navbar apenas se `hideNavbar` for `false` */}
            {!hideNavbar && <Navbar/>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    
    content: {
       paddingBottom: 150,
        padding: 20,
        
    },
});

export default AppLayouts;
