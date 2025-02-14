import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Buttons  = ({ title, onPress, color, textColor }) => {
    return (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
            <Text style={[styles.text]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#015927', // Cor de fundo do botão
        borderRadius: 30, //rredondamento das bordas do botão
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
        width:'100%',
    },
    text: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Poppins-Bold',
    },
});

export default Buttons;