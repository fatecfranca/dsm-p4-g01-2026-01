import { useState, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import MainTabs from './src/navigation/MainTabs'
import AnimatedSplash from './src/screens/SplashScreen'

SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()

function MainApp() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
  )
}

function AppWrapper() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts({})
  const [appIsReady, setAppIsReady] = useState(false)
  const [showApp, setShowApp] = useState(false)

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync()
        await new Promise((resolve) => setTimeout(resolve, 2500))
        setAppIsReady(true)
      }
    }
    prepare()
  }, [fontsLoaded])

  if (!showApp) {
    return (
      <AnimatedSplash
        appIsReady={appIsReady}
        onFinish={() => setShowApp(true)}
      />
    )
  }

  return <AppWrapper />
}
