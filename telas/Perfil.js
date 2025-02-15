import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppLayouts from '../componentes/AppLayouts';
import Navbar from '../componentes/Navbar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Perfil = () => {
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

    return (
        <AppLayouts>
          <View style={styles.perfilBox}>
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
        fontSize: 17,
    }

});

export default Perfil;