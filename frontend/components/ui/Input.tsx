import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/AppTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ label, error, isPassword = false, style, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, focused && styles.inputFocused, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={Colors.text.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.text.secondary, marginBottom: Spacing.xs, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    minHeight: 48,
  },
  inputFocused: { borderColor: Colors.borderFocus, backgroundColor: Colors.background },
  inputError: { borderColor: Colors.like },
  input: { flex: 1, fontSize: FontSize.base, color: Colors.text.primary, paddingVertical: Spacing.sm },
  eyeBtn: { padding: Spacing.xs },
  error: { fontSize: FontSize.xs, color: Colors.like, marginTop: 4 },
});
