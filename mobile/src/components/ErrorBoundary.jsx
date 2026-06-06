import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (__DEV__) {
      console.error('ErrorBoundary:', error, info);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.danger} />
        <Text style={styles.title}>Algo deu errado</Text>
        <Text style={styles.subtitle}>
          Ocorreu um erro inesperado. Tente recarregar o aplicativo.
        </Text>
        {__DEV__ && this.state.error ? (
          <Text style={styles.errorText} numberOfLines={6}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
        ) : null}
        <TouchableOpacity style={styles.btn} onPress={this.reset} activeOpacity={0.85}>
          <Ionicons name="refresh-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.btnText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  errorText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 12,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default ErrorBoundary;
