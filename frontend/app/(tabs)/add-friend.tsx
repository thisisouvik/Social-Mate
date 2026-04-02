import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_FRIENDS } from '@/data/mockData';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';

export default function AddFriendScreen() {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState(
    MOCK_FRIENDS.map(f => ({ ...f, added: false }))
  );

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleAdd(id: string) {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, added: !f.added } : f));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People You May Know</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people..."
          placeholderTextColor={Colors.text.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mutual}>
                <Ionicons name="people-outline" size={12} color={Colors.text.muted} />
                {'  '}{item.mutualFriends} mutual friends
              </Text>
              <Text style={styles.location}>
                <Ionicons name="location-outline" size={12} color={Colors.text.muted} />
                {'  '}{item.location}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtn, item.added && styles.addBtnActive]}
              onPress={() => toggleAdd(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.added ? 'checkmark' : 'person-add-outline'}
                size={16}
                color={item.added ? Colors.text.white : Colors.primary}
              />
              <Text style={[styles.addBtnText, item.added && styles.addBtnTextActive]}>
                {item.added ? 'Added' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={Colors.text.muted} />
            <Text style={styles.emptyText}>No people found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text.primary },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, height: 44, fontSize: FontSize.base, color: Colors.text.primary },
  list: { paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: Spacing.md },
  info: { flex: 1, gap: 3 },
  name: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  mutual: { fontSize: FontSize.xs, color: Colors.text.muted },
  location: { fontSize: FontSize.xs, color: Colors.text.muted },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  addBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  addBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  addBtnTextActive: { color: Colors.text.white },
  empty: { alignItems: 'center', marginTop: 80, gap: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.text.muted },
});
