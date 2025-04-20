import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieWrapper from '../components/LottieWrapper';

type RootStackParamList = {
  login: undefined;
  register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'register'>;

const RegisterSuccessAnimation: React.FC = () => {
  const navigation = useNavigation<NavigationProp>(); 

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      navigation.navigate('login');
    }, 4000); 

    return () => clearTimeout(animationTimeout); 
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.overlay} />
      <LottieWrapper
        source={require('../assets/animations/success-register.json')}
        autoPlay
        loop={false}
         style={styles.lottieAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(20, 20, 20)',
  },
  lottieAnimation: {
    width: 300,
    height: 300,
    zIndex: 1,
  },
});

export default RegisterSuccessAnimation;
