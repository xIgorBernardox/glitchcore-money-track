import Ionicons from '@expo/vector-icons/Ionicons';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getDatabase } from "../database/db";
import { initializeDatabase } from "../database/initializeDatabase";
import styles from "../styles/secondaryListStyle";

type Item = {
  id: string;
  description: string;
  price: number;
  position: number; // Adicionando campo position para o drag
};

type SecondaryListProps = {
  listId: string;
};

const SecondaryList = ({ route }: { route: any }) => {
  const listId = route.params?.listId;
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const setup = async () => {
      const database = await getDatabase();
      setDb(database);
      await initializeDatabase();
      await checkPositionColumn(database); // Verifica coluna position
      if (listId) {
        loadItems(database);
      }
    };
    setup();
  }, [listId]);

  // Verifica e adiciona coluna position se não existir
  const checkPositionColumn = async (database: SQLiteDatabase) => {
    const result = await database.getAllAsync(
      `PRAGMA table_info(secondaryList);`
    );
    const hasPositionColumn = result.some(
      (col: any) => col.name === "position"
    );

    if (!hasPositionColumn) {
      await database.execAsync(`
        ALTER TABLE secondaryList ADD COLUMN position INTEGER DEFAULT 0;
      `);
    }
  };

  const loadItems = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync(
        "SELECT * FROM secondaryList WHERE primaryListId = ? ORDER BY position ASC",
        [listId]
      );

      const data = rows.map((item: any) => ({
        id: item.id.toString(),
        description: item.description,
        price: item.price,
        position: item.position || 0,
      }));

      setItems(data);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
    }
  };

  const addItem = async () => {
    const numericPrice = parseFloat(price.replace(",", "."));
    if (!description.trim() || isNaN(numericPrice)) return;

    if (db) {
      try {
        // Pega a última posição
        const lastPos = await db.getFirstAsync<{ max: number }>(
          "SELECT MAX(position) as max FROM secondaryList WHERE primaryListId = ?",
          [listId]
        );
        const newPosition = (lastPos?.max ?? -1) + 1;

        await db.runAsync(
          "INSERT INTO secondaryList (description, price, primaryListId, position) VALUES (?, ?, ?, ?)",
          [description.trim(), numericPrice, listId, newPosition]
        );

        loadItems(db); // Recarrega os itens para garantir sincronização
        setDescription("");
        setPrice("");
      } catch (err) {
        console.error("Erro ao adicionar item:", err);
      }
    }
  };

  const removeItem = async (id: string) => {
    if (db) {
      try {
        await db.runAsync("DELETE FROM secondaryList WHERE id = ?", [id]);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Erro ao deletar item:", err);
      }
    }
  };

  // Atualiza a ordem no banco de dados
  const updateItemOrder = async (reorderedItems: Item[]) => {
    if (!db) return;

    try {
      await db.runAsync("BEGIN TRANSACTION");
      for (let i = 0; i < reorderedItems.length; i++) {
        await db.runAsync(
          "UPDATE secondaryList SET position = ? WHERE id = ?",
          [i, reorderedItems[i].id]
        );
      }
      await db.runAsync("COMMIT");
    } catch (err) {
      console.error("Erro ao atualizar posições:", err);
      await db.runAsync("ROLLBACK");
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
    <TouchableOpacity
      style={[
        styles.itemRow,
        isActive && {
          backgroundColor: "#3d3d3d",
          opacity: 0.9,
          borderLeftWidth: 3,
          borderLeftColor: "#adff2f",
        },
      ]}
      onLongPress={drag}
      delayLongPress={100}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item.description}</Text>
        <Text style={styles.itemPrice}>R${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-bin" size={24} color="#ff0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Ionicons name="add" size={20} color="#000" />
          </View>
        </TouchableOpacity>

        <DraggableFlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => {
            setItems(data);
            updateItemOrder(data);
          }}
          activationDistance={5}
          dragHitSlop={{ left: 15, right: 15 }}
          containerStyle={{ flex: 1 }}
        />

        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: R${total.toFixed(2)}</Text>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default SecondaryList;