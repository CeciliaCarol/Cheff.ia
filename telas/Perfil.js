import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AppLayouts from '../componentes/AppLayouts';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, updateDoc, doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const Perfil = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userId, setUserId] = useState(route.params?.userId || null);
  const [user, setUser] = useState(null);
  const [numReceitas, setNumReceitas] = useState(0);
  const [numSeguidores, setNumSeguidores] = useState(0);
  const [numSeguindo, setNumSeguindo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !userId) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!route.params?.userId && currentUser) {
      setUserId(currentUser.uid);
    }
  }, [route.params?.userId, currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const receitasQuery = query(collection(db, 'receitas'), where('userId', '==', userId));
        const receitasSnapshot = await getDocs(receitasQuery);
        setNumReceitas(receitasSnapshot.size);

        const seguidoresQuery = query(collection(db, 'seguir'), where('seguidoId', '==', userId));
        const seguidoresSnapshot = await getDocs(seguidoresQuery);
        setNumSeguidores(seguidoresSnapshot.size);

        const seguindoQuery = query(collection(db, 'seguir'), where('seguidorId', '==', userId));
        const seguindoSnapshot = await getDocs(seguindoQuery);
        setNumSeguindo(seguindoSnapshot.size);
      } catch (error) {
        console.error('Erro ao buscar dados adicionais:', error);
      }
    };
    fetchData();
  }, [userId, isFollowing]);

  useEffect(() => {
    if (!currentUser || !userId || currentUser.uid === userId) return;
    const checkFollowing = async () => {
      const followQuery = query(collection(db, 'seguir'), where('seguidorId', '==', currentUser.uid), where('seguidoId', '==', userId));
      const followSnapshot = await getDocs(followQuery);
      setIsFollowing(!followSnapshot.empty);
    };
    checkFollowing();
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      const followQuery = query(collection(db, 'seguir'), where('seguidorId', '==', currentUser.uid), where('seguidoId', '==', userId));
      const followSnapshot = await getDocs(followQuery);
      if (followSnapshot.empty) {
        await addDoc(collection(db, 'seguir'), { seguidorId: currentUser.uid, seguidoId: userId });
        setIsFollowing(true);
      } else {
        followSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Erro ao seguir/desseguir:', error);
    }
  };

  const handleChangeProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissaõ necessária", "É necessário acesso á galeria para mudar a fotode perfil.");
      return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8});
  if (!result.cancelled) {
    setLoading(true);
    try {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profile_pictures/${userId}.jpg`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await updateProfile(currentUser, { photoURL:downloadURL });
      await updateDoc(doc(db, 'users', userId), { photoURL: downloadURL });

      setUser((prevUser) => ({ ...prevUser, photoURL: downloadURL }));
    } catch (error) {
      console.error('Erro ao mudar a foto de perfil:', error);
    } finally {
      setLoading(false);
    }
  }
};

  return (
    <AppLayouts>
      <View style={styles.perfilBox}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        
        {currentUser?.uid === userId && (
          <TouchableOpacity onPress={handleChangeProfilePicture} style={styles.editButton}>
            <Ionicons name='pencil' size={24} color="#000"/>
          </TouchableOpacity>

        )}
        
        <Image source={user?.photoURL ? { uri: user.photoURL } : require('../assets/default-profile.png')} style={styles.perfilImage} />
        {loading ? <ActivityIndicator size="large" color="#000" /> : <Text style={styles.nome}>{user?.name || 'Usuário não encontrado'}</Text>}
        {currentUser && currentUser.uid !== userId && (
          
          <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>{isFollowing ? 'Deixar de Seguir' : 'Seguir'}</Text>
          </TouchableOpacity>
          
        )}
      </View>
      <View style={styles.conteudo}>
        <View style={styles.box}><Text style={styles.number}>{numReceitas}</Text><Text style={styles.legenda}>Receitas</Text></View>
        <View style={styles.box}><Text style={styles.number}>{numSeguidores}</Text><Text style={styles.legenda}>Seguidores</Text></View>
        <View style={styles.box}><Text style={styles.number}>{numSeguindo}</Text><Text style={styles.legenda}>Seguindo</Text></View>
      </View>
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  perfilBox: { 
    alignItems: 'center', 
    backgroundColor: '#F9D5CD', 
    padding: 15, 
    borderRadius: 20 
  },
  backButton: { 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    backgroundColor: '#fff', 
    width: 35, 
    height: 35, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  perfilImage: { 
    width: 180, 
    height: 180, 
    borderRadius: 100, 
    margin: 20 
  },
  nome: { 
    fontSize: 24, 
    fontWeight: '700' 
  },
  followButton: { 
    marginTop: 10, 
    backgroundColor: '#015927', 
    adding: 10, 
    borderRadius: 10, 
    padding: 10,
  },
  followButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  conteudo: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '100%', 
    padding: 10 
  },
  box: { 
    width: 100, 
    height: 100, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10, 
    backgroundColor: '#fff', 
    elevation: 3, 
    margin: 15 
  },
  number: { 
    fontSize: 30, 
    fontWeight: '700', 
    color: '#015927' 
  },
  legenda: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 5,
  },
});

export default Perfil;
