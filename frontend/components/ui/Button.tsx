import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/AppTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, style, textStyle,
}: ButtonProps) {
  const btnStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];
  const txtStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.text.white : Colors.primary} size="small" />
      ) : (
        <Text style={txtStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
  },
  primary: { backgroundColor: Colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.border },
  ghost: { backgroundColor: 'transparent' },
  size_sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, minHeight: 36 },
  size_md: { paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.xl, minHeight: 44 },
  size_lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, minHeight: 52 },
  disabled: { opacity: 0.5 },
  text: { fontWeight: FontWeight.semibold },
  text_primary: { color: Colors.text.white },
  text_outline: { color: Colors.text.primary },
  text_ghost: { color: Colors.primary },
  textSize_sm: { fontSize: FontSize.sm },
  textSize_md: { fontSize: FontSize.base },
  textSize_lg: { fontSize: FontSize.md },
});
