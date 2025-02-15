import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AppLayouts from '../componentes/AppLayouts';
import Navbar from '../componentes/Navbar';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Perfil = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });

    return () => unsubscribe();

 }, []);

 //Função para voltar pra tela anterior
 const handlegoBack = () => {
    navigation.goBack();
 };

 //função para selecionar a imagem
 const pickImage = async () => {
    const permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        Alert.alert('Permissão necesaária', 'Você precisa permitir o acesso à galeria.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });
    if (!result.cancelled) {
        uploadImage(result.assets[0].uri);
    }
 };

 //Função para subir a imagem para o firebase Storege
 const uploadImage = async (imageUri) => {
    try {
        const storage = getStorage();
        const auth = getAuth();
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });

        setUser({ ...auth.currentUser, photoURL: downloadURL });

        Alert.alert('Sucesso', 'Foto de perfil atualizado');
    } catch (error) {
        console.error( 'Erro ao fazer upload da imagem:', error);
        Alert.alert('Erro', 'Não foi possivel atualizar a foto.');
    }
 };

    return (
        <AppLayouts>
          <View style={styles.perfilBox}>
            <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
                <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
                <Image 
                source={{ uri: user?.photoURL || null, }} 
                style={[styles.perfilImage, !user?.photoURL && styles.defaultImage]} 
                />
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
                <Ionicons name="pencil" size={20} color="black"/>
            </TouchableOpacity>
            <Text style={styles.nome}>{user?.displayName || 'Nome do Usuário'}</Text>
          </View>
          <View style={styles.conteudo}>
            <View style={styles.box}>
                <Text style={styles.number}>26</Text>
                <Text style={styles.legenda}>Receitas</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.number}>12</Text>
                <Text style={styles.legenda}>Seguidores</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.number}>28</Text>
                <Text style={styles.legenda}>Likes</Text>
            </View>
          </View>
          <View style={styles.optioncontent}>
             <View style={styles.content}>
                <Text style={styles.legenda}>Minhas Receitas</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Receitas')}>
                <Ionicons name="chevron-forward" size={30} color="black"/>
                </TouchableOpacity>
             </View>
             <View style={styles.content}>
                <Text style={styles.legenda}>Sair</Text>
                <TouchableOpacity>
                <Ionicons name="exit-outline" size={30} color="red"/>
                </TouchableOpacity>
             </View>
          </View>
        <Navbar/>
        </AppLayouts>
    );
};

const styles = StyleSheet.create({
    perfilBox: {
       alignItems: "center",
       backgroundColor: "#F9D5CD",
       padding: 15,
       borderRadius: 10,
       width: "100%",
       justifyContent: "flex-start",
    },
    backButton: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: 10,
        backgroundColor: "#fff",
        width: 35,
        height: 35,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    perfilImage: {
       width: 180,
       height: 180,
       borderRadius: 100,
       margin: 20,
    },
    defaultImage: {
        backgroundColor: "#ccc",
    },
    editIcon: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        width: 35,
        height: 35,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    nome: {
       fontSize: 24,
       fontWeight: "700",
    },
    conteudo: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        margin: 20,
    },
    box: {
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 3,
        margin: 15,
    },
    number: {
        fontSize: 30,
        fontWeight: "700",
        color: "#015927",
    },
    legenda: {
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
         backgroundColor: "#F9D5CD",
         width: "100%",
         padding: 20,
         borderRadius: 20,
         margin: 10,
    },
    optioncontent: {
         flexDirection: "column",

    },
});

export default Perfil;