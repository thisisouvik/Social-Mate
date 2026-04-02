import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Avatar from '@/components/ui/Avatar';
import { MOCK_COMMENTS, MOCK_POSTS, LIKE_AVATARS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';
import type { Comment } from '@/data/mockData';

function CommentItem({ comment, nested = false }: { comment: Comment; nested?: boolean }) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <View style={[styles.commentWrap, nested && styles.nestedComment]}>
      <Avatar uri={comment.user.avatar} name={comment.user.name} size={36} />
      <View style={styles.commentBody}>
        <Text style={styles.commentName}>{comment.user.name}</Text>
        <Text style={styles.commentTime}>{comment.user.time}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        {comment.image && (
          <Image source={{ uri: comment.image }} style={styles.commentImage} resizeMode="cover" />
        )}
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Text style={styles.commentActionText}>like</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="thumbs-up-outline" size={13} color={Colors.primary} />
            <Text style={styles.commentActionCount}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="heart" size={13} color={Colors.heart} />
            <Text style={styles.commentActionCount}>{comment.hearts}</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.commentActionText}>{comment.replies.length} reply</Text>
          </TouchableOpacity>
        </View>
        {comment.replies.length > 0 && (
          <TouchableOpacity onPress={() => setShowReplies(!showReplies)} style={{ marginTop: Spacing.xs }}>
            <Text style={styles.showReplies}>
              {showReplies ? 'Hide Replies...' : 'Show Previous Replies...'}
            </Text>
          </TouchableOpacity>
        )}
        {showReplies && comment.replies.map(r => (
          <CommentItem key={r.id} comment={r} nested />
        ))}
      </View>
    </View>
  );
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const post = MOCK_POSTS.find(p => p.id === id) ?? MOCK_POSTS[0];
  const [commentText, setCommentText] = useState('');
  const [sortLabel, setSortLabel] = useState('Most Recent');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Likes section */}
          <View style={styles.likesSection}>
            <Text style={styles.sectionLabel}>Like</Text>
            <View style={styles.likeAvatars}>
              {LIKE_AVATARS.slice(0, 5).map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={[styles.likeAvatar, { marginLeft: i > 0 ? -8 : 0 }]}
                />
              ))}
              <View style={styles.likeExtraWrap}>
                <Text style={styles.likeExtra}>+{post.likes > 5 ? `${Math.round((post.likes - 5) / 100) * 100}` : 0}</Text>
              </View>
            </View>
          </View>

          {/* Comments header */}
          <View style={styles.commentsHeader}>
            <Text style={styles.sectionLabel}>Comments</Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortText}>{sortLabel}</Text>
              <Ionicons name="swap-vertical-outline" size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Comment list */}
          <View style={styles.commentsList}>
            {MOCK_COMMENTS.map(c => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Comment input */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputBarAction}>
            <Ionicons name="attach-outline" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputBarAction}>
            <Ionicons name="happy-outline" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={Colors.text.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, commentText && styles.sendBtnActive]}
            disabled={!commentText}
          >
            <Ionicons
              name="paper-plane"
              size={20}
              color={commentText ? Colors.primary : Colors.text.muted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text.primary },
  likesSection: { padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary, marginBottom: Spacing.sm },
  likeAvatars: { flexDirection: 'row', alignItems: 'center' },
  likeAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.background },
  likeExtraWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginLeft: -8, borderWidth: 2, borderColor: Colors.background,
  },
  likeExtra: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  commentsHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  sortText: { fontSize: FontSize.sm, color: Colors.text.secondary },
  commentsList: { padding: Spacing.base, gap: Spacing.base },
  commentWrap: { flexDirection: 'row', gap: Spacing.sm },
  nestedComment: { marginLeft: Spacing.xxl, marginTop: Spacing.sm },
  commentBody: { flex: 1 },
  commentName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  commentTime: { fontSize: FontSize.xs, color: Colors.text.muted, marginBottom: Spacing.xs },
  commentText: { fontSize: FontSize.base, color: Colors.text.primary, lineHeight: 21, marginBottom: Spacing.xs },
  commentImage: { width: '100%', height: 140, borderRadius: BorderRadius.sm, marginBottom: Spacing.xs },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  commentActionText: { fontSize: FontSize.xs, color: Colors.text.secondary, fontWeight: FontWeight.medium },
  commentActionCount: { fontSize: FontSize.xs, color: Colors.text.secondary },
  dot: { fontSize: FontSize.xs, color: Colors.text.muted },
  showReplies: { fontSize: FontSize.sm, color: Colors.text.secondary, fontWeight: FontWeight.medium },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.background, gap: Spacing.xs,
  },
  inputBarAction: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  commentInput: {
    flex: 1, minHeight: 38, maxHeight: 100,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs + 2,
    fontSize: FontSize.base, color: Colors.text.primary,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: {},
});
