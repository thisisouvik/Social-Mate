import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/AppTheme';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  isBookmarked: boolean;
};

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Full-time', 'Contract', 'Remote'];

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || j.type === activeFilter || j.location === activeFilter;
    return matchSearch && matchFilter;
  });

  function toggleBookmark(id: string) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Jobs</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.text.muted} style={{ marginRight: Spacing.sm }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies..."
          placeholderTextColor={Colors.text.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Job }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={styles.cardTop}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.company}>{item.company}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                <Ionicons
                  name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={item.isBookmarked ? Colors.primary : Colors.text.muted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Ionicons name="location-outline" size={12} color={Colors.text.secondary} />
                <Text style={styles.tagText}>{item.location}</Text>
              </View>
              <View style={styles.tag}>
                <Ionicons name="time-outline" size={12} color={Colors.text.secondary} />
                <Text style={styles.tagText}>{item.type}</Text>
              </View>
              <View style={styles.tag}>
                <Ionicons name="cash-outline" size={12} color={Colors.text.secondary} />
                <Text style={styles.tagText}>{item.salary}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.postedAt}>{item.postedAt}</Text>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {filtered.length === 0 && (
        <View style={styles.emptyWrap}>
          <Ionicons name="briefcase-outline" size={44} color={Colors.text.muted} />
          <Text style={styles.emptyText}>No job data yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text.primary },
  filterBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    marginHorizontal: Spacing.base, marginVertical: Spacing.md,
    borderRadius: BorderRadius.full, paddingHorizontal: Spacing.base,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  searchInput: { flex: 1, height: 44, fontSize: FontSize.base, color: Colors.text.primary },
  filtersRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.base, marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.text.secondary, fontWeight: FontWeight.medium },
  chipTextActive: { color: Colors.text.white },
  list: { paddingHorizontal: Spacing.base, gap: Spacing.md, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.lg,
    padding: Spacing.base, ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text.primary },
  company: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F3F4F6', borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
  tagText: { fontSize: FontSize.xs, color: Colors.text.secondary },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  postedAt: { fontSize: FontSize.xs, color: Colors.text.muted },
  applyBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs + 2,
  },
  applyBtnText: { fontSize: FontSize.sm, color: Colors.text.white, fontWeight: FontWeight.semibold },
  emptyWrap: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  emptyText: { color: Colors.text.secondary, fontSize: FontSize.base },
});
