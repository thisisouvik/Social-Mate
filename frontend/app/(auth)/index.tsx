import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/components/shared/Logo';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing, Shadow } from '@/constants/AppTheme';

// ── SSO Buttons using Ionicons ────────────────────────────────────────────────
import { Ionicons } from '@expo/vector-icons';

function SSOButton({ provider, onPress }: { provider: 'google' | 'microsoft'; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ssoBtn} onPress={onPress} activeOpacity={0.8}>
      <Ionicons
        name={provider === 'google' ? 'logo-google' : 'logo-microsoft'}
        size={20}
        color={provider === 'google' ? '#DB4437' : '#00A4EF'}
      />
      <Text style={styles.ssoBtnText}>{provider === 'google' ? 'Google' : 'Microsoft'}</Text>
    </TouchableOpacity>
  );
}

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.form}>
      <Input
        label="E-mail/Phone"
        placeholder="Email/Phone"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        isPassword
      />
      <TouchableOpacity style={styles.forgotRow}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.mainBtn, loading && styles.mainBtnDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
        <Text style={styles.mainBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or signin with</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.ssoRow}>
        <SSOButton provider="google" onPress={() => handleLogin()} />
        <SSOButton provider="microsoft" onPress={() => handleLogin()} />
      </View>

      <TouchableOpacity onPress={onSwitch} style={styles.switchRow}>
        <Text style={styles.switchText}>Don&apos;t have an Account? </Text>
        <Text style={styles.switchLink}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!name || !email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password !== confirm) { Alert.alert('Error', 'Passwords do not match'); return; }
    setLoading(true);
    try {
      await signUp(name, email, password);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.form}>
      <Input label="Your Full Name" placeholder="your name" value={name} onChangeText={setName} />
      <Input label="Email/Phone" placeholder="Type your email/phone" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" placeholder="Type your password" value={password} onChangeText={setPassword} isPassword />
      <Input label="Confirm Password" placeholder="Retype your password" value={confirm} onChangeText={setConfirm} isPassword />

      <TouchableOpacity style={[styles.mainBtn, loading && styles.mainBtnDisabled]} onPress={handleJoin} disabled={loading} activeOpacity={0.88}>
        <Text style={styles.mainBtnText}>{loading ? 'Creating account...' : 'Join Now'}</Text>
      </TouchableOpacity>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or sign up with</Text>
        <View style={styles.orLine} />
      </View>

      <View style={styles.ssoRow}>
        <SSOButton provider="google" onPress={() => handleJoin()} />
        <SSOButton provider="microsoft" onPress={() => handleJoin()} />
      </View>

      <View style={styles.tosRow}>
        <Text style={styles.tosText}>By Using this app you agree with the </Text>
        <TouchableOpacity><Text style={styles.tosLink}>Terms of Service</Text></TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AuthScreen() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Logo size="md" />
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setTab('signin')}>
              <Text style={[styles.tabText, tab === 'signin' && styles.tabTextActive]}>Sign in</Text>
              {tab === 'signin' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setTab('signup')}>
              <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>Sign up</Text>
              {tab === 'signup' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>
          <View style={styles.tabDivider} />

          {/* Form */}
          {tab === 'signin'
            ? <SignInForm onSwitch={() => setTab('signup')} />
            : <SignUpForm onSwitch={() => setTab('signin')} />
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
  logoRow: { alignItems: 'center', marginVertical: Spacing.xxl },
  tabRow: { flexDirection: 'row', gap: Spacing.xl },
  tabItem: { paddingBottom: Spacing.sm },
  tabText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.text.secondary },
  tabTextActive: { color: Colors.text.primary, fontWeight: FontWeight.bold },
  tabUnderline: { height: 2.5, backgroundColor: Colors.text.primary, marginTop: Spacing.xs, borderRadius: 2 },
  tabDivider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.xl },
  form: { gap: 0 },
  forgotRow: { alignItems: 'flex-end', marginBottom: Spacing.base },
  forgotText: { color: Colors.text.secondary, fontSize: FontSize.sm },
  mainBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  mainBtnDisabled: { opacity: 0.6 },
  mainBtnText: { color: Colors.text.white, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.base },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontSize: FontSize.sm, color: Colors.text.secondary },
  ssoRow: { flexDirection: 'row', gap: Spacing.base, marginBottom: Spacing.lg },
  ssoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.background,
    ...Shadow.sm,
  },
  ssoBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.text.primary },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.base },
  switchText: { fontSize: FontSize.base, color: Colors.text.secondary },
  switchLink: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.semibold },
  tosRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Spacing.md },
  tosText: { fontSize: FontSize.sm, color: Colors.text.secondary },
  tosLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});
