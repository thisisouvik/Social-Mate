import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Avatar from '@/components/ui/Avatar';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';
import type { FeedPost } from '@/types/social';

interface PostCardProps {
  post: FeedPost;
  onLike?: (id: string) => Promise<{ isLiked: boolean; likesCount: number } | void>;
  onShare?: (id: string) => Promise<{ sharesCount: number } | void>;
  onBookmark?: (id: string) => void;
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function PostCard({ post, onLike, onShare, onBookmark }: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [shares, setShares] = useState(post.shares);

  useEffect(() => {
    setLiked(post.isLiked);
    setLikes(post.likes);
    setShares(post.shares);
  }, [post.id, post.isLiked, post.likes, post.shares]);

  async function handleLike() {
    const optimisticLiked = !liked;
    const optimisticLikes = liked ? likes - 1 : likes + 1;
    setLiked(optimisticLiked);
    setLikes(optimisticLikes);

    if (!onLike) {
      return;
    }

    try {
      const result = await onLike(post.id);
      if (result) {
        setLiked(result.isLiked);
        setLikes(result.likesCount);
      }
    } catch {
      setLiked(liked);
      setLikes(likes);
    }
  }

  async function handleShare() {
    setShares((prev) => prev + 1);

    if (!onShare) {
      return;
    }

    try {
      const result = await onShare(post.id);
      if (result) {
        setShares(result.sharesCount);
      }
    } catch {
      setShares(post.shares);
    }
  }

  function handleBookmark() {
    setBookmarked(!bookmarked);
    onBookmark?.(post.id);
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar uri={post.authorAvatar} name={post.authorName} size={42} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.authorName}</Text>
          <Text style={styles.time}>{new Date(post.createdAt).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Image */}
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} resizeMode="cover" />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.action} onPress={handleLike}>
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={20}
              color={liked ? Colors.primary : Colors.text.secondary}
            />
            <Text style={[styles.actionText, liked && styles.actionTextActive]}>
              {formatCount(likes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={() => router.push(`/post/${post.id}`)}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
            <Text style={styles.actionText}>{formatCount(post.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={handleShare}>
            <Ionicons name="arrow-redo-outline" size={20} color={Colors.text.secondary} />
            <Text style={styles.actionText}>{formatCount(shares)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked ? Colors.primary : Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  headerInfo: { flex: 1, marginLeft: Spacing.sm },
  userName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  time: { fontSize: FontSize.xs, color: Colors.text.muted, marginTop: 2 },
  moreBtn: { padding: Spacing.xs },
  content: { fontSize: FontSize.base, color: Colors.text.primary, lineHeight: 22, marginBottom: Spacing.sm },
  postImage: { width: '100%', height: 200, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  leftActions: { flexDirection: 'row', gap: Spacing.base },
  action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  actionText: { fontSize: FontSize.sm, color: Colors.text.secondary, fontWeight: FontWeight.medium },
  actionTextActive: { color: Colors.primary },
});
