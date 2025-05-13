import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import RegisterSuccessAnimation from "../components/RegisterSuccessAnimation";
import { getDatabase } from "../database/db";
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
  const [showAnimation, setShowAnimation] = useState(false);

  const nextStep = async () => {
    if (step === 1) {
      if (!username.trim()) {
        Alert.alert("Erro", "O nome de usuário é obrigatório.");
        return;
      }

      const db = await getDatabase();
      console.log({ db });
      // Verificar se o nome de usuário já está cadastrado
      const usernameExists = await db.getAllAsync(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      console.log({ usernameExists });
      if (usernameExists.length > 0) {
        Alert.alert("Erro", "Esse nome de usuário já está em uso.");
        return;
      }
      setStep(2);
    }

    if (step === 2) {
      if (!email.trim() || !confirmEmail.trim()) {
        Alert.alert(
          "Erro",
          "Os campos de e-mail e confirmação são obrigatórios."
        );
        return;
      }
      if (email !== confirmEmail) {
        Alert.alert("Erro", "Os e-mails não coincidem.");
        return;
      }

      const db = await getDatabase();
      // Verificar se o e-mail já está cadastrado
      const emailExists = await db.getAllAsync(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (emailExists.length > 0) {
        Alert.alert("Erro", "Esse e-mail já está em uso.");
        return;
      }
      setStep(3);
    }

    if (step === 3) {
      if (!password.trim() || !confirmPassword.trim()) {
        Alert.alert("Erro", "Os campos de senha são obrigatórios.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
      }
      setStep(4);
    }

    if (step === 4) {
      if (!phone.trim()) {
        Alert.alert("Erro", "O número de celular é obrigatório.");
        return;
      }
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleRegister = async () => {
    try {
      const db = await getDatabase();

      // Inserir o usuário no banco de dados
      await db.runAsync(
        "INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)",
        [username, email, password, phone]
      );

      setShowAnimation(true);
      setTimeout(() => {
        navigation.navigate("login");
      }, 3000);
    } catch (err) {
      console.error("Erro ao registrar usuário", err);
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };

  if (showAnimation) {
    return <RegisterSuccessAnimation />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;