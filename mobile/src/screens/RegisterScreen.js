import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import { useAuth } from '../contexts/AuthContext';

function FloatingLabelInput({ label, icon, secureTextEntry, value, onChangeText, autoCapitalize, rightAccessory }) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', 'rgba(35,197,94,0.5)'],
  });

  return (
    <Animated.View style={[s.inputWrap, { borderColor }]}>
      {icon}
      <TextInput
        style={s.input}
        placeholder={label}
        placeholderTextColor="#475569"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize={autoCapitalize || 'none'}
      />
      {rightAccessory}
    </Animated.View>
  );
}

export default function RegisterScreen({ navigation }) {
  const { cadastro } = useAuth();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCadastro() {
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await cadastro(name, email, password);
      navigation?.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err) {
      const status = err?.status;
      const msg = err?.data?.error;
      if (status === 400) {
        setError(msg || 'Erro ao criar conta.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={['#0A1120', '#0F172A', '#14213D']} style={s.headerGradient}>
          {/* LOGO */}
          <FadeInView style={s.logoWrap}>
            <Image
              source={require('../../assets/logo.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={s.appName}>EcoSense</Text>
          </FadeInView>

          {/* TITLE + SUB */}
          <FadeInView delay={150} style={s.titleWrap}>
            <Text style={[s.title, { fontSize: isSmall ? 24 : 28 }]}>Criar sua conta</Text>
            <Text style={s.subtitle}>
              Monitore seu consumo de energia em tempo real
            </Text>
          </FadeInView>

          {/* FORM */}
          <FadeInView delay={300} style={s.formWrap}>
            <FloatingLabelInput
              label="Seu nome"
              icon={<Ionicons name="person-outline" size={18} color="#94A3B8" />}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <FloatingLabelInput
              label="Seu e-mail"
              icon={<Ionicons name="mail-outline" size={18} color="#94A3B8" />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <FloatingLabelInput
              label="Sua senha"
              icon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              rightAccessory={
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              }
            />
            <FloatingLabelInput
              label="Confirmar senha"
              icon={<Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {error ? (
              <View style={s.errorBox}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[s.btnPrimary, loading && s.btnDisabled]}
              activeOpacity={0.8}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F172A" size="small" />
              ) : (
                <Text style={s.btnPrimaryText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <View style={s.loginWrap}>
              <Text style={s.loginText}>Já tem conta? </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation?.navigate('Login')}
              >
                <Text style={s.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        </LinearGradient>

        <View style={s.footer}>
          <Text style={s.footerText}>
            P.I 4º Semestre — EcoSense — Monitoramento inteligente para um futuro sustentável
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  /* LOGO */
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 72,
    height: 50,
    marginBottom: 8,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  /* TITLE */
  titleWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },

  /* FORM */
  formWrap: {
    gap: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
  },
  btnPrimary: {
    backgroundColor: '#23C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#23C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  loginWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  loginLink: {
    color: '#23C55E',
    fontSize: 13,
    fontWeight: '700',
  },

  /* FOOTER */
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
