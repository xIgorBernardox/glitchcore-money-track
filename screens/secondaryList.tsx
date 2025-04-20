import Ionicons from '@expo/vector-icons/Ionicons';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getDatabase } from '../database/db';
import { initializeDatabase } from '../database/initializeDatabase'; // Importe a função de inicialização
import styles from '../styles/secondaryListStyle';

type Item = {
  id: string;
  description: string;
  price: number;
};

type SecondaryListProps = {
  listId: string;
};

const SecondaryList = ({ route }: { route: any }) => {
  const listId = route.params?.listId; // Pegando listId via params
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const setup = async () => {
      const database = await getDatabase();
      setDb(database);
      await initializeDatabase(); // Certifique-se de chamar a função de inicialização
      if (listId) {
        loadItems(database);
      } else {
        console.error("listId não encontrado!");
      }
    };
    setup();
  }, [listId]); // Dependência do listId para garantir que será chamado novamente quando necessário

  // Carregar itens do banco de dados
  const loadItems = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync(
        'SELECT * FROM secondaryList WHERE primaryListId = ?',
        [listId]
      );

      const data = (
        rows as { id: number; description: string; price: number }[]
      ).map((item) => ({
        id: item.id.toString(),
        description: item.description,
        price: item.price,
      }));

      setItems(data);
    } catch (err) {
      console.error('Erro ao buscar itens:', err);
    }
  };

  // Adicionar item no banco de dados
  const addItem = async () => {
    const numericPrice = parseFloat(price.replace(',', '.'));
    if (!description.trim() || isNaN(numericPrice)) return;

    if (db) {
      try {
        await db.runAsync(
          'INSERT INTO secondaryList (description, price, primaryListId) VALUES (?, ?, ?)',
          [description.trim(), numericPrice, listId]
        );
        // Atualiza a lista local
        const newItem = {
          id: Date.now().toString(),
          description: description.trim(),
          price: numericPrice,
        };
        setItems((prev) => [...prev, newItem]);
        setDescription('');
        setPrice('');
      } catch (err) {
        console.error('Erro ao adicionar item:', err);
      }
    }
  };

  // Remover item do banco de dados
  const removeItem = async (id: string) => {
    if (db) {
      try {
        await db.runAsync('DELETE FROM secondaryList WHERE id = ?', [id]);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Erro ao deletar item:', err);
      }
    }
  };

  // Calcular total
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
          <Ionicons name="add" size={20} color="#000" style={styles.addIcon} />
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
              <Ionicons
                name="trash-bin"
                size={24}
                color="#ff0000"
                style={styles.removeIcon}
              />
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