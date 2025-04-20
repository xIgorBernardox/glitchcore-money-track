import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/secondaryListStyle';

type Item = {
  id: string;
  description: string;
  price: number;
};

const SecondaryList = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const addItem = () => {
    const numericPrice = parseFloat(price.replace(',', '.'));
    if (!description.trim() || isNaN(numericPrice)) return;

    const newItem: Item = {
      id: Date.now().toString(),
      description: description.trim(),
      price: numericPrice,
    };

    setItems([...items, newItem]);
    setDescription('');
    setPrice('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#adff2f"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        placeholderTextColor="#adff2f"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Adicionar</Text>
          <Ionicons name="add" size={20} color="#000" style={styles.addIcon}/>
        </View>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemPrice}>R${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-bin" size={24} color="#ff0000" style={styles.removeIcon}/>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: R${total.toFixed(2)}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};
export default SecondaryList;