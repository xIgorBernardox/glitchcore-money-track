import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/primaryListStyle';
import { RootStackParamList } from '../types/navigationTypes';

type ListItem = {
  id: string;
  name: string;
};

const PrimaryList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState<ListItem[]>([]);

  const handleAddList = () => {
    if (listName.trim() === '') {
      Alert.alert('Erro', 'O nome da lista não pode estar vazio.');
      return;
    }

    const newList: ListItem = {
      id: Date.now().toString(),
      name: listName.trim(),
    };

    setLists([...lists, newList]);
    setListName('');
  };

  const handleDeleteList = (id: string) => {
    setLists(lists.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.itemButton}
        onPress={() => navigation.navigate('secondaryList', { listId: item.id })}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteList(item.id)}>
        <Ionicons name="trash-bin" size={24} color="#ff0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nova lista (Ex: Mercado)"
        placeholderTextColor="#adff2f"
        value={listName}
        onChangeText={setListName}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddList}>
        <View style={styles.buttonContent}>
          <Text style={styles.addButtonText}>Criar Lista</Text>
          <Ionicons name="add" size={20} color="#000" style={styles.addIcon}/>
        </View>
      </TouchableOpacity>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma lista criada ainda.</Text>}
      />
    </View>
  );
};
export default PrimaryList;