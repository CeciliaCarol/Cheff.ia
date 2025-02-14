import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = ({ placeholder, value, onChangeText, placeholderTextcolor}) => {
    return (
        <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextcolor}
        />
    );
};

const styles = StyleSheet.create({
    input:{
        borderWidth: 1,
        borderColor: '#F37E8F',
        padding: 10,
        borderRadius: 10,
        marginTop: 2, 
        width: "100%",
    },
});

export default Input;