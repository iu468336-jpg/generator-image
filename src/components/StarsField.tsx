import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface StarsFieldProps {
  count?: number;
  animated?: boolean;
}

interface Star {
  leftPercent: number;
  topPercent: number;
  size: number;
  delay: number;
}

export function StarsField({ count = 18, animated = true }: StarsFieldProps) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, () => ({
        leftPercent: Math.random() * 100,
        topPercent: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 1500,
      })),
    [count]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star, index) => (
        <Twinkle key={index} star={star} animated={animated} />
      ))}
    </View>
  );
}

function Twinkle({ star, animated }: { star: Star; animated: boolean }) {
  const opacity = useRef(new Animated.Value(0.3 + Math.random() * 0.4)).current;

  useEffect(() => {
    if (!animated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, delay: star.delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animated, opacity, star.delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${star.leftPercent}%` as const,
        top: `${star.topPercent}%` as const,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
}
