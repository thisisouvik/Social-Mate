import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/shared/Logo';
import CreatePostBar from '@/components/home/CreatePostBar';
import StoryBar from '@/components/home/StoryBar';
import PostCard from '@/components/home/PostCard';
import { useAuth } from '@/context/AuthContext';
import { buildStoriesFromPosts, fetchPosts, sharePost, togglePostLike } from '@/lib/socialApi';
import { Colors } from '@/constants/Colors';
import { FontSize, Spacing } from '@/constants/AppTheme';
import type { FeedPost } from '@/types/social';

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const stories = useMemo(
    () => buildStoriesFromPosts(posts, user?.name, user?.avatar),
    [posts, user?.name, user?.avatar],
  );

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  }

  async function handleLike(postId: string) {
    const result = await togglePostLike(postId);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: result.is_liked,
              likes: result.likes_count,
            }
          : post,
      ),
    );

    return {
      isLiked: result.is_liked,
      likesCount: result.likes_count,
    };
  }

  async function handleShare(postId: string) {
    const result = await sharePost(postId);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              shares: result.shares_count,
            }
          : post,
      ),
    );

    return { sharesCount: result.shares_count };
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Logo size="sm" />
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="paper-plane-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Create Post */}
        <View style={{ paddingTop: Spacing.md }}>
          <CreatePostBar user={user} />
        </View>

        {/* Stories */}
        <View style={styles.section}>
          <StoryBar stories={stories} />
        </View>

        {/* Feed */}
        <View style={{ paddingTop: Spacing.sm }}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No posts yet.</Text>
            </View>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} onShare={handleShare} />
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerActions: { flexDirection: 'row', gap: Spacing.xs },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.like,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.background,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
});
