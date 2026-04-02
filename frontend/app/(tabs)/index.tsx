import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/components/shared/Logo';
import CreatePostBar from '@/components/home/CreatePostBar';
import StoryBar from '@/components/home/StoryBar';
import PostCard from '@/components/home/PostCard';
import { useAuth } from '@/context/AuthContext';
import { MOCK_POSTS, MOCK_STORIES } from '@/data/mockData';
import { Colors } from '@/constants/Colors';
import { FontSize, Spacing } from '@/constants/AppTheme';

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
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
          <StoryBar stories={MOCK_STORIES} />
        </View>

        {/* Feed */}
        <View style={{ paddingTop: Spacing.sm }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
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
});
