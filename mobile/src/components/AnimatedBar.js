import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export default function AnimatedBar({ height: h, index, color }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      delay: index * 60,
      useNativeDriver: false,
    }).start();
  }, []);

  const barHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, h],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        height: '100%',
        borderRadius: 4,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: color || (index % 3 === 1 ? '#3B82F6' : '#23C55E'),
        opacity: anim,
        transform: [{ scaleY: anim }],
        maxHeight: barHeight,
      }}
    />
  );
}
