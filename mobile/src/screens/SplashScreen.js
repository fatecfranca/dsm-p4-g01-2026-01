import { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet, Image, Easing } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const LOADING_MESSAGES = [
  'Inicializando sistema...',
  'Conectando ao monitoramento energético...',
  'Carregando sensores IoT...',
  'Estabilizando conexão de rede...',
]

function AnimatedDot({ index }) {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const dotDelay = index * 300
    const duration = 500
    const pause = 1000

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(dotDelay),
        Animated.timing(anim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.15,
          duration,
          useNativeDriver: true,
        }),
        Animated.delay(pause),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [])

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.85],
  })

  return <Animated.View style={[styles.dot, { opacity }]} />
}

export default function SplashScreen({ appIsReady, onFinish }) {
  const [messageIndex, setMessageIndex] = useState(0)

  const logoOpacity = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.7)).current
  const breatheAnim = useRef(new Animated.Value(1)).current
  const messageOpacity = useRef(new Animated.Value(0)).current
  const exitOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.04,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [])

  useEffect(() => {
    messageOpacity.setValue(0)
    Animated.timing(messageOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    const interval = setInterval(() => {
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start()
      })
    }, 3200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (appIsReady) {
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onFinish()
      })
    }
  }, [appIsReady])

  return (
    <Animated.View style={[styles.container, { opacity: exitOpacity }]}>
      <LinearGradient
        colors={['#0A1120', '#0F172A', '#0A1120']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoWrap,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }, { scale: breatheAnim }],
              },
            ]}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>EcoSense</Text>
          </Animated.View>

          <Animated.Text style={[styles.message, { opacity: messageOpacity }]}>
            {LOADING_MESSAGES[messageIndex]}
          </Animated.Text>

          <View style={styles.indicatorRow}>
            <AnimatedDot index={0} />
            <AnimatedDot index={1} />
            <AnimatedDot index={2} />
          </View>
        </View>

        <Text style={styles.footer}>
          Monitoramento Inteligente de Energia
        </Text>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 32,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 96,
    height: 68,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  message: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  footer: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    letterSpacing: 0.5,
    paddingBottom: 48,
  },
})
