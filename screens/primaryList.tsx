import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SQLiteDatabase } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getDatabase } from "../database/db";
import styles from "../styles/primaryListStyle";
import { RootStackParamList } from "../types/navigationTypes";

type ListItem = {
  id: string;
  name: string;
  position: number;
  total?: number;
};

const PrimaryList = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<ListItem[]>([]);
  const [totalGasto, setTotalGasto] = useState<number>(0);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const setup = async () => {
      const database = await getDatabase();
      setDb(database);
      loadLists(database);
      calcularTotalGeral(database);
    };
    setup();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (db) {
        loadLists(db);
        calcularTotalGeral(db);
      }
    }, [db])
  );

  const loadLists = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync(`
        SELECT p.id, p.name, p.position, 
          (SELECT SUM(s.price) FROM secondaryList s WHERE s.primaryListId = p.id) AS total
        FROM primaryList p
        ORDER BY p.position ASC
      `);

      const data = (rows as any[]).map((item) => ({
        id: item.id.toString(),
        name: item.name,
        position: item.position ?? 0,
        total: item.total ?? 0,
      }));

      setLists(data);
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
    }
  };

  type TotalResponse = { total: number | null };

  const calcularTotalGeral = async (database: SQLiteDatabase) => {
    try {
      const rows = await database.getAllAsync(`
        SELECT SUM(s.price) AS total
        FROM secondaryList s
        INNER JOIN primaryList p ON s.primaryListId = p.id
      `);

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
      const lastPositionResult = await db.getFirstAsync<{
        maxPosition: number;
      }>("SELECT MAX(position) AS maxPosition FROM primaryList");
      const nextPosition = (lastPositionResult?.maxPosition ?? -1) + 1;

      const result = await db.runAsync(
        "INSERT INTO primaryList (name, position) VALUES (?, ?)",
        [listName.trim(), nextPosition]
      );

      // Atualiza o total geral após inserir a nova lista
      await calcularTotalGeral(db);

      const newList: ListItem = {
        id: result.lastInsertRowId?.toString() || Date.now().toString(),
        name: listName.trim(),
        position: nextPosition,
      };
      setLists((prev) => [...prev, newList]);
      setListName("");
    } catch (error) {
      console.error("Erro ao inserir lista:", error);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (!db) return;

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync(
                "DELETE FROM secondaryList WHERE primaryListId = ?",
                [id]
              );
              await db.runAsync("DELETE FROM primaryList WHERE id = ?", [id]);

              const updatedLists = lists.filter((item) => item.id !== id);
              setLists(updatedLists);

              await calcularTotalGeral(db);
            } catch (error) {
              console.error("Erro ao deletar lista:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const updateListOrderInDB = async (data: ListItem[]) => {
    if (!db) return;
    try {
      await db.runAsync("BEGIN TRANSACTION");
      for (let i = 0; i < data.length; i++) {
        await db.runAsync("UPDATE primaryList SET position = ? WHERE id = ?", [
          i,
          data[i].id,
        ]);
      }
      await db.runAsync("COMMIT");
    } catch (err) {
      console.error("Erro ao atualizar ordem:", err);
      await db.runAsync("ROLLBACK");
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ListItem>) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        isActive && {
          backgroundColor: "#8bcb25",
          opacity: 0.9,
          borderLeftWidth: 3,
          borderLeftColor: "#ff0000",
        },
      ]}
      onLongPress={drag}
      delayLongPress={100}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.itemButton}
        onPress={() =>
          navigation.navigate("secondaryList", { listId: item.id })
        }
      >
        <View>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={{ color: "#000", fontSize: 12 }}>
            Total: R${item.total?.toFixed(2) ?? "0.00"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteList(item.id)}>
        <Ionicons name="trash-bin" size={24} color="#ff0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Ionicons
              name="add"
              size={20}
              color="#000"
              style={styles.addIcon}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.totalText}>
          Total Gasto: R${totalGasto.toFixed(2)}
        </Text>

        <DraggableFlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => {
            setLists(data);
            updateListOrderInDB(data);
          }}
          activationDistance={5}
          dragHitSlop={{ left: 15, right: 15 }}
          // autoscrollSpeed={200} // Velocidade do scroll automático
        />
      </View>
    </GestureHandlerRootView>
  );
};
export default PrimaryList;