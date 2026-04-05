import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export default function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 36 : 44;
  const textSize = size === 'sm' ? 16 : size === 'md' ? 22 : 28;

  return (
    <View style={styles.container}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 44 44">
        <Circle cx="22" cy="22" r="22" fill={Colors.primaryLight} />
        <Circle cx="22" cy="22" r="15" fill={Colors.primary} />
        {/* Chat bubble icon */}
        <Path
          d="M15 18C15 16.895 15.895 16 17 16H27C28.105 16 29 16.895 29 18V24C29 25.105 28.105 26 27 26H24L21 29V26H17C15.895 26 15 25.105 15 24V18Z"
          fill="white"
        />
        <Circle cx="19" cy="21" r="1.2" fill={Colors.primary} />
        <Circle cx="22" cy="21" r="1.2" fill={Colors.primary} />
        <Circle cx="25" cy="21" r="1.2" fill={Colors.primary} />
      </Svg>

      {variant === 'full' && (
        <View style={styles.textContainer}>
          <Text style={[styles.social, { fontSize: textSize }]}>SOCIAL</Text>
          <Text style={[styles.mate, { fontSize: textSize }]}> MATE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  social: {
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 1,
  },
  mate: {
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
});
