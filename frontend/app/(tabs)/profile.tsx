import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Avatar from '@/components/ui/Avatar';
import PostCard from '@/components/home/PostCard';
import { useAuth } from '@/context/AuthContext';
import { MOCK_POSTS } from '@/data/mockData';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{typeof value === 'number' && value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'details'>('posts');
  const myPosts = MOCK_POSTS.filter((_, i) => i < 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover + Avatar */}
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' }}
            style={styles.coverImage}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'] as [string, string]}
            style={StyleSheet.absoluteFill}
          />
          {/* Settings icon */}
          <TouchableOpacity style={styles.settingsBtn} onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color={Colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* Avatar on cover */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarBorder}>
            <Avatar uri={user?.avatar} name={user?.name} size={88} />
          </View>
        </View>

        {/* Name & Bio */}
        <View style={styles.nameSection}>
          <Text style={styles.name}>{user?.name ?? 'Social Mate User'}</Text>
          <Text style={styles.username}>{user?.username ?? '@username'}</Text>
          <Text style={styles.bio}>{user?.bio ?? 'No bio yet'}</Text>
        </View>

        {/* Edit + Settings */}
        <View style={styles.editRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>EDIT PROFILE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gearBtn}>
            <Ionicons name="settings-outline" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox label="Post" value={user?.posts ?? 0} />
          <View style={styles.statDivider} />
          <StatBox label="Photos" value={user?.photos ?? 0} />
          <View style={styles.statDivider} />
          <StatBox label="Followers" value={user?.followers ?? 0} />
          <View style={styles.statDivider} />
          <StatBox label="Following" value={user?.following ?? 0} />
        </View>

        {/* Posts / Details tab */}
        <View style={styles.tabRow}>
          {(['posts', 'details'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabItem, activeTab === t && styles.tabItemActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'posts' ? (
          <View style={{ paddingTop: Spacing.sm }}>
            {myPosts.map(post => (
              <PostCard key={post.id} post={{ ...post, user: { ...post.user, name: user?.name ?? post.user.name, avatar: user?.avatar ?? post.user.avatar } }} />
            ))}
          </View>
        ) : (
          <View style={styles.detailsSection}>
            <DetailItem icon="mail-outline" label="Email" value={user?.email ?? 'N/A'} />
            <DetailItem icon="person-outline" label="Username" value={user?.username ?? 'N/A'} />
            <DetailItem icon="briefcase-outline" label="Occupation" value={user?.bio ?? 'N/A'} />
            <DetailItem icon="people-outline" label="Followers" value={`${user?.followers ?? 0} people`} />
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  coverWrap: { height: 200, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  settingsBtn: {
    position: 'absolute', top: Spacing.base, right: Spacing.base,
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarWrap: { alignItems: 'center', marginTop: -50 },
  avatarBorder: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3.5, borderColor: Colors.primary,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  nameSection: { alignItems: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.base },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text.primary },
  username: { fontSize: FontSize.base, color: Colors.text.secondary, marginTop: 2 },
  bio: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 4, textAlign: 'center' },
  editRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginTop: Spacing.base, paddingHorizontal: Spacing.xxl,
  },
  editBtn: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingVertical: Spacing.sm, alignItems: 'center',
  },
  editBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text.primary, letterSpacing: 1 },
  gearBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: Colors.background, marginTop: Spacing.base,
    marginHorizontal: Spacing.base, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base, ...Shadow.sm,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.text.muted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.background,
    marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  tabItem: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.text.primary },
  tabText: { fontSize: FontSize.base, color: Colors.text.muted, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.text.primary, fontWeight: FontWeight.bold },
  detailsSection: {
    backgroundColor: Colors.background, margin: Spacing.base,
    borderRadius: BorderRadius.lg, padding: Spacing.base, gap: Spacing.base, ...Shadow.sm,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  detailIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  detailLabel: { fontSize: FontSize.xs, color: Colors.text.muted },
  detailValue: { fontSize: FontSize.base, color: Colors.text.primary, fontWeight: FontWeight.medium },
});
