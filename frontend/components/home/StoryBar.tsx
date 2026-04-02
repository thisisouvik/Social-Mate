import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/AppTheme';
import type { Story } from '@/data/mockData';

interface StoryBarProps {
  stories: Story[];
}

export default function StoryBar({ stories }: StoryBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.8}>
          {story.isOwn ? (
            <View style={styles.addStoryCircle}>
              <Ionicons name="add" size={28} color={Colors.primary} />
            </View>
          ) : (
            <LinearGradient
              colors={story.hasStory ? [Colors.primary, '#7B2FFF'] : [Colors.border, Colors.border]}
              style={styles.storyRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.storyImageWrapper}>
                <Image source={{ uri: story.avatar }} style={styles.storyImage} />
              </View>
            </LinearGradient>
          )}
          <Text style={styles.storyName} numberOfLines={1}>{story.user}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.base,
  },
  storyItem: { alignItems: 'center', width: 62 },
  addStoryCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
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
    width: 61,
    height: 61,
    borderRadius: 30.5,
    borderWidth: 2,
    borderColor: Colors.background,
    overflow: 'hidden',
  },
  storyImage: { width: '100%', height: '100%' },
  storyName: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
    maxWidth: 62,
  },
});
