import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';
import { fetchNotifications, markAllNotificationsRead } from '@/lib/socialApi';
import type { SocialNotification } from '@/types/social';

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

function NotificationCard({ item }: { item: SocialNotification }) {
  let cta = '';
  if (item.type === 'follow') cta = 'Follow Back';
  if (item.type === 'new_post') cta = 'View Post';

  // Handle the style depending on notification type. For likes and comments, we might not have a CTA.
  // We check if it's read
  return (
    <View style={[styles.card, !item.isRead && styles.unreadCard]}>
      <TouchableOpacity style={styles.moreBtn}>
        <Ionicons name="ellipsis-horizontal" size={14} color={Colors.text.muted} />
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: item.actorAvatar }} style={styles.avatar} />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.contentWrap}>
          <Text style={styles.messageLine}>
            <Text style={styles.name}>{item.actorDisplayName} </Text>
            <Text style={styles.messageInline}>{item.message}</Text>
          </Text>

          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>

          {cta ? (
            <TouchableOpacity style={styles.ctaBtn}>
              <Text style={styles.ctaText}>{cta}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      // Mark all as read when loaded
      if (data.some(n => !n.isRead)) {
        await markAllNotificationsRead();
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }

  // Group notifications simple approach
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayItems = notifications.filter(n => new Date(n.createdAt).toDateString() === today.toDateString());
  const yesterdayItems = notifications.filter(n => new Date(n.createdAt).toDateString() === yesterday.toDateString());
  const olderItems = notifications.filter(n => {
    const d = new Date(n.createdAt).toDateString();
    return d !== today.toDateString() && d !== yesterday.toDateString();
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={loadNotifications}>
          <Ionicons name="refresh" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.body} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {todayItems.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Today</Text>
              {todayItems.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </>
          )}

          {yesterdayItems.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, styles.sectionGap]}>Yesterday</Text>
              {yesterdayItems.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </>
          )}
          
          {olderItems.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, styles.sectionGap]}>Older</Text>
              {olderItems.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </>
          )}
          
          {notifications.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.text.muted} />
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF4F8' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    color: Colors.text.muted,
    fontSize: FontSize.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 4,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  body: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#222639',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionGap: {
    marginTop: Spacing.base,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EEF0F4',
    ...Shadow.sm,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#F9FAFE',
  },
  moreBtn: {
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.sm,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  unreadDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6767',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  contentWrap: {
    flex: 1,
    paddingRight: 20,
  },
  messageLine: {
    fontSize: FontSize.md,
    lineHeight: 24,
    color: '#4A4E60',
  },
  name: {
    fontWeight: FontWeight.bold,
    color: '#4A4E60',
  },
  messageInline: {
    color: '#4A4E60',
  },
  time: {
    marginTop: 4,
    fontSize: FontSize.xs,
    color: '#9CA3AF',
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    backgroundColor: '#1D70F5',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 1,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
