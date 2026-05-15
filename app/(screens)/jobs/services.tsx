import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Data ────────────────────────────────────────────────────────────────────
const ALL_SERVICES = [
  { id: '1',  name: 'Electrical & Wiring',      icon: '⚡', category: 'Home',        color: '#EAF3FB', accent: '#1A6FBF', jobs: 324 },
  { id: '2',  name: 'Plumbing & Fitting',        icon: '🔧', category: 'Home',        color: '#E1F5EE', accent: '#1D9E75', jobs: 289 },
  { id: '3',  name: 'Air Conditioning Repair',   icon: '❄️', category: 'Home',        color: '#E1F5EE', accent: '#1D9E75', jobs: 218 },
  { id: '4',  name: 'Painting & Finishing',      icon: '🎨', category: 'Home',        color: '#FAEEDA', accent: '#BA7517', jobs: 197 },
  { id: '5',  name: 'CCTV Installation',         icon: '📷', category: 'Security',    color: '#FAECE7', accent: '#D85A30', jobs: 154 },
  { id: '6',  name: 'IT & Networking',           icon: '💻', category: 'Technology',  color: '#EAF3FB', accent: '#1A6FBF', jobs: 132 },
  { id: '7',  name: 'Construction & Building',   icon: '🏗️', category: 'Construction',color: '#FAEEDA', accent: '#BA7517', jobs: 118 },
  { id: '8',  name: 'Fabrication & Welding',     icon: '⚙️', category: 'Construction',color: '#FAECE7', accent: '#D85A30', jobs: 95  },
  { id: '9',  name: 'Garden & Landscaping',      icon: '🌿', category: 'Outdoor',     color: '#E1F5EE', accent: '#1D9E75', jobs: 88  },
  { id: '10', name: 'Transport & Driver',         icon: '🚗', category: 'Transport',   color: '#EAF3FB', accent: '#1A6FBF', jobs: 76  },
  { id: '11', name: 'Cleaning & Housekeeping',   icon: '🧹', category: 'Home',        color: '#E1F5EE', accent: '#1D9E75', jobs: 201 },
  { id: '12', name: 'General Labour',            icon: '👷', category: 'Construction',color: '#FAEEDA', accent: '#BA7517', jobs: 143 },
];

const CATEGORIES = ['All', 'Home', 'Security', 'Technology', 'Construction', 'Outdoor', 'Transport'];

// ─── Animated service card ────────────────────────────────────────────────────
function ServiceCard({
  item,
  index,
  onPress,
}: {
  item: (typeof ALL_SERVICES)[0];
  index: number;
  onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity: fadeAnim, transform: [{ translateY }, { scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.card}
      >
        {/* Accent stripe */}
        <View style={[styles.cardStripe, { backgroundColor: item.accent }]} />

        <View style={styles.cardInner}>
          {/* Icon bubble */}
          <View style={[styles.iconBubble, { backgroundColor: item.color }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>

          {/* Text */}
          <View style={styles.cardBody}>
            <Text style={styles.cardName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.cardMeta}>
              <View style={[styles.categoryChip, { backgroundColor: item.color }]}>
                <Text style={[styles.categoryChipText, { color: item.accent }]}>
                  {item.category}
                </Text>
              </View>
              <Text style={styles.jobCount}>{item.jobs} jobs</Text>
            </View>
          </View>

          {/* Arrow */}
          <View style={[styles.arrowBox, { backgroundColor: item.color }]}>
            <Text style={[styles.arrowText, { color: item.accent }]}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const filtered = ALL_SERVICES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A4A8A" />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Our Services</Text>
          <Text style={styles.headerSub}>{ALL_SERVICES.length} services available</Text>
        </View>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service..."
            placeholderTextColor="#9AB0C4"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Category chips ── */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          contentContainerStyle={styles.catRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catChip, activeCategory === item && styles.catChipActive]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.catChipText, activeCategory === item && styles.catChipTextActive]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Results count ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length === 1 ? 'service' : 'services'} found
        </Text>
      </View>

      {/* ── Services list ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ServiceCard
            item={item}
            index={index}
            onPress={() =>
              router.push({
                pathname: '/(screens)/jobs/create',
                params: { serviceId: item.id, serviceName: item.name, serviceIcon: item.icon },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySub}>Try a different search or category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EAF3FB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A6FBF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: '#fff', lineHeight: 26 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 1 },

  // Search
  searchWrapper: {
    backgroundColor: '#1A6FBF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F1C2E', height: 46 },
  clearBtn: {
    width: 24, height: 24,
    backgroundColor: '#EAF3FB',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  clearText: { fontSize: 10, color: '#5A7A9A', fontWeight: '700' },

  // Categories
  catRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.2)',
  },
  catChipActive: {
    backgroundColor: '#1A6FBF',
    borderColor: '#1A6FBF',
  },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#5A7A9A' },
  catChipTextActive: { color: '#fff' },

  // Results count
  resultsRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsText: { fontSize: 12, color: '#5A7A9A', fontWeight: '500' },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },

  // Card
  cardWrapper: { borderRadius: 16, overflow: 'hidden' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.12)',
    overflow: 'hidden',
  },
  cardStripe: {
    height: 3,
    width: '100%',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBubble: {
    width: 52, height: 52,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '700', color: '#0F1C2E', lineHeight: 19, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryChip: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  categoryChipText: { fontSize: 10, fontWeight: '700' },
  jobCount: { fontSize: 11, color: '#5A7A9A', fontWeight: '500' },
  arrowBox: {
    width: 32, height: 32,
    borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  arrowText: { fontSize: 22, fontWeight: '700', lineHeight: 28 },

  // Empty
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F1C2E', marginBottom: 4 },
  emptySub: { fontSize: 13, color: '#5A7A9A' },
});