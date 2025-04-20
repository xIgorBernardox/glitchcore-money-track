import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SQLiteDatabase } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { getDatabase } from "../database/db";
import { initializeDatabase } from "../database/initializeDatabase";
import styles from "../styles/primaryListStyle";
import { RootStackParamList } from "../types/navigationTypes";

type ListItem = {
  id: string;
  name: string;
};

const PrimaryList = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<ListItem[]>([]);
  const [totalGasto, setTotalGasto] = useState<number>(0); // Estado para armazenar o total gasto
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const setup = async () => {
      const database = await getDatabase();
      setDb(database);
      await initializeDatabase();
      loadLists(database);
      calcularTotalGeral(database); // Calcula o total geral
    };
    setup();
  }, []);

  const loadLists = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync("SELECT * FROM primaryList");
      const data = (rows as { id: number; name: string }[]).map((item) => ({
        id: item.id.toString(),
        name: item.name,
      }));
      setLists(data);
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
    }
  };

  type TotalResponse = { total: number | null };
  const calcularTotalGeral = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync(
        "SELECT SUM(price) AS total FROM secondaryList WHERE primaryListId IS NOT NULL"
      );

      const totalGastoCalculado = (rows[0] as TotalResponse).total ?? 0;
      setTotalGasto(totalGastoCalculado);
    } catch (err) {
      console.error("Erro ao calcular total geral:", err);
    }
  };

  const handleAddList = async () => {
    if (!db) return;
    if (listName.trim() === "") {
      Alert.alert("Erro", "O nome da lista não pode estar vazio.");
      return;
    }

    try {
      const result = await db.runAsync(
        "INSERT INTO primaryList (name) VALUES (?)",
        [listName.trim()]
      );
      const newList: ListItem = {
        id: result.lastInsertRowId?.toString() || Date.now().toString(),
        name: listName.trim(),
      };
      setLists((prev) => [...prev, newList]);
      setListName("");
    } catch (error) {
      console.error("Erro ao inserir lista:", error);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (!db) return;
    try {
      await db.runAsync("DELETE FROM primaryList WHERE id = ?", [id]);
      setLists((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
    }
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.itemButton}
        onPress={() =>
          navigation.navigate("secondaryList", { listId: item.id })
        }
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
          <Ionicons name="add" size={20} color="#000" style={styles.addIcon} />
        </View>
      </TouchableOpacity>

      {/* Exibe o total gasto */}
      <Text style={styles.totalText}>
        Total Gasto: R${totalGasto.toFixed(2)}
      </Text>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma lista criada ainda.</Text>
        }
      />
    </View>
  );
};
export default PrimaryList;
