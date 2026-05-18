import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Text style={s.emoji}>{'\uD83D\uDCCA'}</Text>
        <Text style={s.title}>Dashboard</Text>
        <Text style={s.sub}>
          Seu painel completo com gráficos, alertas e análises detalhadas do consumo de energia está sendo preparado.
        </Text>
        <TouchableOpacity
          style={s.button}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.buttonText}>{'\u2190'} Voltar para Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#23C55E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
