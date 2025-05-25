import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getDatabase } from "../database/db";
import styles from "../styles/loginStyle";
import { RootStackParamList } from "../types/navigationTypes";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = async () => {
    if (step === "username") {
      if (username.trim() === "") {
        Alert.alert("Erro", "Nome de usuário é obrigatório.");
        return;
      }

      const db = await getDatabase();
      // Verificar se o nome de usuário existe no banco de dados
      const userExists = await db.getAllAsync(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      if (userExists.length === 0) {
        Alert.alert("Erro", "Usuário incorreto.");
        return;
      }

      setStep("password");
    } else {
      if (password.trim() === "") {
        Alert.alert("Erro", "Senha é obrigatória.");
        return;
      }

      const db = await getDatabase();
      // Verificar se user e a senha está correta
      const user = await db.getAllAsync(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
      );

      if (user.length === 0) {
        Alert.alert("Erro", "Usuário ou senha inválido.");
        return;
      }

      const storeData = async (user: any) => {
        try {
          const jsonValue = JSON.stringify(user);
          await AsyncStorage.setItem("user", jsonValue);
          const userData = await AsyncStorage.getItem("user");
          console.log({ AsyncStorage: JSON.parse(userData!) });
        } catch (e) {
          // saving error
        }
      };
      storeData(user);

      // Senha correta, fazer login
      navigation.replace("myLists"); // ou 'PrimaryList' dependendo da rota
    }
  };

  const goToRegister = () => {
    // navigation.navigate('Minhas Listas');
    navigation.navigate("register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo-login.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder={
          step === "username"
            ? "Digite seu nome de usuário"
            : "Digite sua senha"
        }
        placeholderTextColor="#adff2f"
        value={step === "username" ? username : password}
        onChangeText={step === "username" ? setUsername : setPassword}
        secureTextEntry={step === "password"}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {step === "username" ? "Próximo" : "Entrar"}
          </Text>
          <SimpleLineIcons
            name="login"
            size={18}
            color="#000"
            style={{ marginLeft: 8 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.registerText}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>

      <View>
        <Image
          source={require("../assets/powered-glitchcore.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default LoginScreen;