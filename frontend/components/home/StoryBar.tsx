import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Modal, Image, Pressable, Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadStory } from '@/lib/socialApi';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '@/components/ui/Avatar';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/AppTheme';
import type { StoryItem } from '@/types/social';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryBarProps {
  stories: StoryItem[];
  onStoryUploaded?: () => void;
}

export default function StoryBar({ stories, onStoryUploaded }: StoryBarProps) {
  const [uploading, setUploading] = useState(false);
  const [viewingStory, setViewingStory] = useState<StoryItem | null>(null);

  // ── Upload a new story ────────────────────────────────────────────
  const handleAddStory = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow media library permission to add stories.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Error', 'Could not read image data.');
        return;
      }

      setUploading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error('Not logged in');

        const ext = (asset.fileName || 'story.jpg').split('.').pop()?.toLowerCase() || 'jpg';
        const contentType = `image/${ext === 'png' ? 'png' : 'jpeg'}`;
        const storagePath = `${session.user.id}/stories/story_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('posts_media')
          .upload(storagePath, decode(asset.base64), {
            contentType,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        await uploadStory({
          storage_path: storagePath,
          text: '',
        });

        Alert.alert('Success', 'Story uploaded successfully!');
        onStoryUploaded?.();
      } catch (e: any) {
        console.error('Story upload error:', e);
        Alert.alert('Error', e.message || 'Failed to upload story');
      } finally {
        setUploading(false);
      }
    }
  };

  // ── Handle story circle press ─────────────────────────────────────
  const handleStoryPress = (story: StoryItem) => {
    if (story.isOwn) {
      if (story.hasStory) {
        // User already has a story — show it, with option to add more
        setViewingStory(story);
      } else {
        // No story yet — open picker
        handleAddStory();
      }
    } else {
      // View another user's story
      setViewingStory(story);
    }
  };

  // ── Resolve story image URI (signed URL fallback for private bucket)
  const [resolvedStoryUri, setResolvedStoryUri] = useState<string>('');
  const [storyImgFailed, setStoryImgFailed] = useState(false);
  const [triedSignedStory, setTriedSignedStory] = useState(false);

  const openStoryViewer = (story: StoryItem) => {
    const imgUrl = story.storyImageUrl || '';
    setResolvedStoryUri(imgUrl);
    setStoryImgFailed(false);
    setTriedSignedStory(false);
    setViewingStory(story);
  };

  const handleStoryImageError = async () => {
    if (!triedSignedStory && viewingStory?.storagePath) {
      setTriedSignedStory(true);
      try {
        const { data, error } = await supabase.storage
          .from('posts_media')
          .createSignedUrl(viewingStory.storagePath, 3600);
        if (!error && data?.signedUrl) {
          setResolvedStoryUri(data.signedUrl);
          return;
        }
      } catch {}
    }
    // Also try extracting path from the URL itself
    if (!triedSignedStory && resolvedStoryUri) {
      setTriedSignedStory(true);
      const match = resolvedStoryUri.split('?')[0].match(/posts_media\/(.+)$/);
      if (match) {
        try {
          const { data, error } = await supabase.storage
            .from('posts_media')
            .createSignedUrl(match[1], 3600);
          if (!error && data?.signedUrl) {
            setResolvedStoryUri(data.signedUrl);
            return;
          }
        } catch {}
      }
    }
    setStoryImgFailed(true);
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            activeOpacity={0.8}
            onPress={() => {
              if (story.isOwn) {
                if (story.hasStory) {
                  openStoryViewer(story);
                } else {
                  handleAddStory();
                }
              } else {
                openStoryViewer(story);
              }
            }}
            disabled={uploading && story.isOwn}
          >
            {story.isOwn ? (
              <View style={styles.ownStoryWrap}>
                <Avatar uri={story.avatar} name={story.user} size={58} />
                {!uploading ? (
                  <View style={styles.addBadge}>
                    <Ionicons name="add" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.addBadge}>
                    <ActivityIndicator size={10} color="#FFFFFF" />
                  </View>
                )}
                {story.hasStory && (
                  <View style={styles.ownStoryRing} />
                )}
              </View>
            ) : (
              <LinearGradient
                colors={story.hasStory ? [Colors.primary, '#7B2FFF'] : [Colors.border, Colors.border]}
                style={styles.storyRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.storyImageWrapper}>
                  <Avatar uri={story.avatar} name={story.user} size={55} />
                </View>
              </LinearGradient>
            )}
            <Text style={styles.storyName} numberOfLines={1}>
              {story.isOwn ? 'Your Story' : story.user}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Story Viewer Modal ──────────────────────────────────── */}
      <Modal visible={!!viewingStory} animationType="fade" transparent onRequestClose={() => setViewingStory(null)}>
        <Pressable style={styles.viewerOverlay} onPress={() => setViewingStory(null)}>
          {/* Header */}
          <View style={styles.viewerHeader}>
            <View style={styles.viewerUserInfo}>
              <Avatar uri={viewingStory?.avatar} name={viewingStory?.user} size={36} />
              <Text style={styles.viewerUserName}>{viewingStory?.user}</Text>
            </View>
            <TouchableOpacity onPress={() => setViewingStory(null)} style={styles.viewerCloseBtn}>
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Story Image */}
          {resolvedStoryUri && !storyImgFailed ? (
            <Image
              source={{ uri: resolvedStoryUri }}
              style={styles.viewerImage}
              resizeMode="contain"
              onError={handleStoryImageError}
            />
          ) : (
            <View style={styles.viewerNoImage}>
              <Ionicons name="image-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.viewerNoImageText}>Story image unavailable</Text>
            </View>
          )}

          {/* Add Story button for own story viewer */}
          {viewingStory?.isOwn && (
            <TouchableOpacity
              style={styles.viewerAddBtn}
              onPress={() => {
                setViewingStory(null);
                setTimeout(handleAddStory, 300);
              }}
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text style={styles.viewerAddText}>Add New Story</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.base,
  },
  storyItem: { alignItems: 'center', width: 66 },
  ownStoryWrap: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
    zIndex: 2,
  },
  ownStoryRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImageWrapper: {
    width: 59,
    height: 59,
    borderRadius: 29.5,
    borderWidth: 2,
    borderColor: Colors.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyName: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
    maxWidth: 66,
  },
  // ── Story Viewer Modal ──────────────────────────────────
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  viewerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewerUserName: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  viewerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  viewerNoImage: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  viewerNoImageText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: FontSize.base,
  },
  viewerAddBtn: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
  },
  viewerAddText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
