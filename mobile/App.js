import { useState, useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import AnimatedSplash from './src/screens/SplashScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

function MainApp() {
  const { isAuthenticated, ready } = useAuth();
  const wasAuthed = useRef(isAuthenticated);

  useEffect(() => {
    if (!ready) return;
    if (wasAuthed.current && !isAuthenticated && navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    wasAuthed.current = isAuthenticated;
  }, [ready, isAuthenticated]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    setAppIsReady(true);
  }, []);

  if (!showApp) {
    return (
      <AnimatedSplash
        appIsReady={appIsReady}
        onFinish={() => setShowApp(true)}
      />
    );
  }

  return (
    <ErrorBoundary>
      <AppWrapper />
    </ErrorBoundary>
  );
}
