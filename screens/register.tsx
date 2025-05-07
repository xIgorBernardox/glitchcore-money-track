import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import RegisterSuccessAnimation from "../components/RegisterSuccessAnimation";
import styles from "../styles/registerStyle";
import { RootStackParamList } from "../types/navigationTypes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "register">;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleRegister = () => {
    console.log("Usuário registrado:", { fullName, email, phone });
    setShowAnimation(true);
  };

  if (showAnimation) {
    return <RegisterSuccessAnimation />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo-login.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Cadastro</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#adff2f"
            value={fullName}
            onChangeText={setFullName}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={prevStep}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={nextStep}
            >
              <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 3 && (
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
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={prevStep}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Registrar-se</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("login")}>
        <Text style={styles.loginLink}>
          Já tem uma conta? <Text style={styles.linkText}>Faça login</Text>
        </Text>
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

export default RegisterScreen;
