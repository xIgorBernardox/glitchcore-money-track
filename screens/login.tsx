import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/loginStyle';
import { RootStackParamList } from "../types/navigationTypes";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  const handleNext = () => {
    if (step === 'phone') {
      // Aqui você poderia enviar o código via SMS
      if (phoneNumber.trim() === '') return;
      setStep('code');
    } else {
      // Verificar código (simulado aqui)
      if (code.trim() === '') return;
      navigation.navigate('Minhas Listas'); // ou 'PrimaryList' dependendo da rota
    }
  };

  const goToRegister = () => {
    navigation.navigate('register');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/money-track-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder={
          step === 'phone'
            ? 'Digite seu número de celular'
            : 'Digite o código que você recebeu'
        }
        placeholderTextColor="#adff2f"
        value={step === 'phone' ? phoneNumber : code}
        onChangeText={step === 'phone' ? setPhoneNumber : setCode}
        keyboardType={step === 'phone' ? 'phone-pad' : 'number-pad'}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {step === 'phone' ? 'Entrar' : 'Enviar Código'}
          </Text>
          <SimpleLineIcons name="login" size={18} color="#000" style={{ marginLeft: 8 }} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.registerText}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LoginScreen;