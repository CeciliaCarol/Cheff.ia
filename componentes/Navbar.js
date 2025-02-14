import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal, Text, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
        {/* Navbar*/}

        <View style={styles.navbar}>
            <TouchableOpacity style={styles.navButton}>
                <Ionicons name="home-outline" size={24} color="black"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
                <Ionicons name="heart-outline" size={24} color="black"/>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={28} color="white"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
                <Ionicons name="bookmark-outline" size={24} color="black"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
                <Ionicons name="person-outline" size={24} color="black"/>
            </TouchableOpacity>
        </View>

        {/* Modal */}

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
        >
            <TouchableOpacity 
            style={styles.modalBack}
            onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
                
                <View style={styles.modalContent}>
                    
                    <View style={styles.optionContainer}>
                    
                    <TouchableOpacity
                    style={styles.optionButton}
                    >
                        <Ionicons name="book-outline" size={40} color="black"/>
                    </TouchableOpacity>
                    <Text style={styles.modalButtonText}>Criar Receita</Text>
                    </View>

                    <View style={styles.optionContainer}>
                    <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                        setModalVisible(false);
                        console.log("Criar com IA");
                    }}
                    >
                        <Ionicons name="bulb-outline" size={40} color="black"/>
                    </TouchableOpacity>
                    <Text style={styles.modalButtonText}>Criar com IA</Text>
                    </View>
                  {/*  <Pressable
                    style={styles.cancelButton}
                    onPress={() => 
                        setModalVisible(false)}
                    >
                        <Text style={styles.modalButtonText}>Cancelar</Text>
                    </Pressable>*/}
                </View>
            </View>
            </TouchableOpacity>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    navbar: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 10,
        elevation: 5,
        borderRadius: 30,  
    },
    navButton: {
        padding: 10,
    },
    createButton: {
        width: 60,
        height: 60,
        backgroundColor: "#015927",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    modalBack: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,

    },

    optionContainer: {
        alignItems: "center",
        marginHorizontal: 20,
    },
    optionButton: {
        backgroundColor: "#F9D5CD",
        borderRadius: 10,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },


});

export default Navbar;