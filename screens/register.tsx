import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { getDatabase } from "../database/db"; // Assumindo que você já tem o SQLite configurado
import styles from "../styles/registerStyle";
import { RootStackParamList } from "../types/navigationTypes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "register">;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [db, setDb] = useState<any>(null); // Configurar SQLite

  const nextStep = () => {
    if (step === 1 && !username.trim()) {
      Alert.alert("Erro", "O nome de usuário é obrigatório.");
      return;
    }
    if (step === 2) {
      if (!email.trim() || !confirmEmail.trim()) {
        Alert.alert("Erro", "Os campos de e-mail e confirmação de e-mail são obrigatórios.");
        return;
      }
      if (email !== confirmEmail) {
        Alert.alert("Erro", "Os e-mails não são iguais.");
        return;
      }
    }
    if (step === 3) {
      if (!password.trim() || !confirmPassword.trim()) {
        Alert.alert("Erro", "Os campos de senha e confirmação de senha são obrigatórios.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não são iguais.");
        return;
      }
    }
    if (step === 4 && !phone.trim()) {
      Alert.alert("Erro", "O número de celular é obrigatório.");
      return;
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleRegister = async () => {
    if (email !== confirmEmail) {
      Alert.alert("Erro", "Os e-mails não são iguais.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não são iguais.");
      return;
    }
  
    try {
      const db = await getDatabase();
  
      // Verifica se o e-mail já existe
      const existingEmail = await db.getFirstAsync(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      if (existingEmail) {
        Alert.alert("Erro", "Este e-mail já está em uso.");
        return;
      }
  
      // Verifica se o nome de usuário já existe
      const existingUsername = await db.getFirstAsync(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
  
      if (existingUsername) {
        Alert.alert("Erro", "Este nome de usuário já está em uso.");
        return;
      }
  
      // Insere no banco de dados
      await db.runAsync(
        "INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)",
        [username, email, password, phone]
      );
  
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("login");
    } catch (err) {
      console.error("Erro ao registrar usuário", err);
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {/* Etapa 1 - Nome de usuário */}
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#adff2f"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Etapa 2 - Email */}
      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#adff2f"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Email"
            placeholderTextColor="#adff2f"
            keyboardType="email-address"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Etapa 3 - Senha */}
      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#adff2f"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            placeholderTextColor="#adff2f"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Etapa 4 - Número de celular */}
      {step === 4 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Número de celular"
            placeholderTextColor="#adff2f"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;