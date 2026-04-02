import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/lib/socialApi';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/AppTheme';

interface PostOption {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
}

const OPTIONS: PostOption[] = [
  { icon: 'image-outline', label: 'Add A Photo', color: '#1D7FE8' },
  { icon: 'videocam-outline', label: 'Add A Video', color: '#7B2FFF' },
  { icon: 'document-attach-outline', label: 'Add A Document', color: '#F59E0B' },
  { icon: 'color-palette-outline', label: 'Background Color', color: '#EC4899' },
  { icon: 'happy-outline', label: 'Add Gif', color: '#22C55E' },
  { icon: 'radio-outline', label: 'Live Video', color: '#EF4444' },
  { icon: 'camera-outline', label: 'Camera', color: '#0EA5E9' },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const audience = 'Public';
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePost() {
    if (!content.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(content.trim());
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create a Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            style={[styles.postBtn, (!content || isSubmitting) && styles.postBtnDisabled]}
            disabled={!content || isSubmitting}
          >
            <Text style={[styles.postBtnText, (!content || isSubmitting) && styles.postBtnTextDisabled]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          {/* User info */}
          <View style={styles.userRow}>
            <Avatar uri={user?.avatar} name={user?.name} size={44} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
              <TouchableOpacity style={styles.audienceBtn}>
                <Ionicons name="earth-outline" size={12} color={Colors.primary} />
                <Text style={styles.audienceText}>{audience}</Text>
                <Ionicons name="chevron-down" size={12} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Text input */}
          <TextInput
            style={styles.input}
            placeholder="What's on your head?"
            placeholderTextColor={Colors.text.muted}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
            textAlignVertical="top"
          />

          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Options */}
          <View style={styles.options}>
            {OPTIONS.map((opt) => (
              <TouchableOpacity key={opt.label} style={styles.option} activeOpacity={0.7}>
                <View style={[styles.optionIcon, { backgroundColor: `${opt.color}18` }]}>
                  <Ionicons name={opt.icon} size={20} color={opt.color} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  postBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2 },
  postBtnDisabled: {},
  postBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primary },
  postBtnTextDisabled: { color: Colors.text.muted },
  body: { flex: 1 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.base,
  },
  userInfo: { gap: Spacing.xs },
  userName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  audienceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  audienceText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  input: {
    minHeight: 120, paddingHorizontal: Spacing.base,
    fontSize: FontSize.md, color: Colors.text.primary, lineHeight: 24,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginVertical: Spacing.base,
  },
  options: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  optionIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLabel: { fontSize: FontSize.md, color: Colors.text.primary, fontWeight: FontWeight.medium },
});
