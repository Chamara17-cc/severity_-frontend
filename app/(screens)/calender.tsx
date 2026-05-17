import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type VisitStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'RevisitScheduled';

type Visit = {
  id: string;
  date: string;        // e.g. "2025-05-17"
  time: string;        // e.g. "10:00 AM"
  serviceType: string; // e.g. "Electrical & Wiring"
  spName: string;      // Service Provider name
  status: VisitStatus;
  location: string;
  jobId: string;
};

// ─── Stub Data (remove when backend is ready) ────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

const STUB_VISITS: Visit[] = [
  {
    id: '1', jobId: 'JOB-001',
    date: TODAY, time: '10:00 AM',
    serviceType: 'Electrical & Wiring',
    spName: 'Kasun Perera',
    status: 'Scheduled', location: 'Colombo 03',
  },
  {
    id: '2', jobId: 'JOB-002',
    date: TODAY, time: '02:30 PM',
    serviceType: 'Plumbing & Fitting',
    spName: 'Nuwan Silva',
    status: 'InProgress', location: 'Nugegoda',
  },
  {
    id: '3', jobId: 'JOB-003',
    date: '2025-05-20', time: '09:00 AM',
    serviceType: 'Air Conditioning Repair',
    spName: 'Roshan Fernando',
    status: 'Scheduled', location: 'Maharagama',
  },
  {
    id: '4', jobId: 'JOB-004',
    date: '2025-05-22', time: '11:00 AM',
    serviceType: 'CCTV Installation',
    spName: 'Dimuth Jayawardena',
    status: 'RevisitScheduled', location: 'Dehiwala',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<VisitStatus, { label: string; color: string; bg: string }> = {
  Scheduled: { label: 'Scheduled', color: '#1A6FBF', bg: '#E8F2FB' },
  InProgress: { label: 'In Progress', color: '#D97706', bg: '#FEF3C7' },
  Completed: { label: 'Completed', color: '#2E9E6B', bg: '#E6F7EF' },
  Cancelled: { label: 'Cancelled', color: '#D94040', bg: '#FCEBEB' },
  RevisitScheduled: { label: 'Revisit Scheduled', color: '#7C3AED', bg: '#EDE9FE' },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const isToday = (dateStr: string) => dateStr === TODAY;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarScreen() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>(STUB_VISITS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // TODO: Replace with real API call
  // GET /api/customer/visits
  // Headers: { Authorization: `Bearer ${accessToken}` }
  // Response: { visits: Visit[] }
  const fetchVisits = async () => {
    setRefreshing(true);
    try {
      // const response = await fetch(`${API_BASE_URL}/api/customer/visits`, {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      // const data = await response.json();
      // setVisits(data.visits);
      await new Promise(r => setTimeout(r, 1000)); // stub delay
    } catch (err) {
      console.error('Failed to fetch visits:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const todayVisits = visits.filter(v => isToday(v.date));
  const upcomingVisits = visits.filter(v => !isToday(v.date));

  // Get unique dates for date chips
  const uniqueDates = [...new Set(visits.map(v => v.date))].sort();

  const filteredVisits = selectedDate
    ? visits.filter(v => v.date === selectedDate)
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF3FB" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Calendar</Text>
          <Text style={styles.headerSubtitle}>Your upcoming visits</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => router.push('/(screens)/notifications')}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchVisits} colors={['#1A6FBF']} />
        }
      >

        {/* Date filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateChips}
        >
          <TouchableOpacity
            style={[styles.dateChip, !selectedDate && styles.dateChipActive]}
            onPress={() => setSelectedDate(null)}
          >
            <Text style={[styles.dateChipText, !selectedDate && styles.dateChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {uniqueDates.map(date => (
            <TouchableOpacity
              key={date}
              style={[styles.dateChip, selectedDate === date && styles.dateChipActive]}
              onPress={() => setSelectedDate(date === selectedDate ? null : date)}
            >
              <Text style={[styles.dateChipText, selectedDate === date && styles.dateChipTextActive]}>
                {isToday(date) ? 'Today' : formatDate(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filtered view */}
        {filteredVisits ? (
          <>
            <Text style={styles.sectionTitle}>
              {selectedDate === TODAY ? "Today's Visits" : formatDate(selectedDate!)}
            </Text>
            {filteredVisits.length === 0 ? (
              <EmptyState message="No visits on this date" />
            ) : (
              filteredVisits.map(visit => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  onPress={() =>
                    router.push(`/(screens)/${visit.jobId}`as any)
                  }
                />
              ))
            )}
          </>
        ) : (
          <>
            {/* Today */}
            <Text style={styles.sectionTitle}>Today</Text>
            {todayVisits.length === 0 ? (
              <EmptyState message="No visits scheduled for today" />
            ) : (
              todayVisits.map(visit => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  onPress={() =>
                    router.push(`/(screens)/${visit.jobId}`as any)
                  }
                />
              ))
            )}

            {/* Upcoming */}
            {upcomingVisits.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Upcoming</Text>
                {upcomingVisits.map(visit => (
                  <VisitCard key={visit.id} visit={visit} onPress={() =>
                    router.push(`/(screens)/${visit.jobId}` as any)
                  } />
                ))}
              </>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Visit Card ───────────────────────────────────────────────────────────────

function VisitCard({ visit, onPress }: { visit: Visit; onPress: () => void }) {
  const status = STATUS_CONFIG[visit.status];
  return (
    <TouchableOpacity style={styles.visitCard} onPress={onPress} activeOpacity={0.85}>
      {/* Left accent */}
      <View style={[styles.visitAccent, { backgroundColor: status.color }]} />

      <View style={styles.visitContent}>
        {/* Top row */}
        <View style={styles.visitTopRow}>
          <Text style={styles.visitService}>{visit.serviceType}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.visitDetails}>
          <View style={styles.visitDetailRow}>
            <Text style={styles.visitDetailIcon}>🕐</Text>
            <Text style={styles.visitDetailText}>
              {isToday(visit.date) ? 'Today' : formatDate(visit.date)} • {visit.time}
            </Text>
          </View>
          <View style={styles.visitDetailRow}>
            <Text style={styles.visitDetailIcon}>👷</Text>
            <Text style={styles.visitDetailText}>{visit.spName}</Text>
          </View>
          <View style={styles.visitDetailRow}>
            <Text style={styles.visitDetailIcon}>📍</Text>
            <Text style={styles.visitDetailText}>{visit.location}</Text>
          </View>
        </View>

        {/* Job ID */}
        <Text style={styles.jobId}>#{visit.jobId}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EAF3FB' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A2A3A', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: '#5A7A9A', marginTop: 2 },
  notifBtn: {
    position: 'relative', width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C8D9EC',
  },
  notifIcon: { fontSize: 18 },
  notifBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#D94040', alignItems: 'center', justifyContent: 'center',
  },
  notifBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Date chips
  dateChips: { paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  dateChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#C8D9EC',
  },
  dateChipActive: { backgroundColor: '#1A6FBF', borderColor: '#1A6FBF' },
  dateChipText: { fontSize: 13, color: '#5A7A9A', fontWeight: '500' },
  dateChipTextActive: { color: '#FFFFFF', fontWeight: '600' },

  // Section
  sectionTitle: {
    fontSize: 15, fontWeight: '600', color: '#1A2A3A',
    marginHorizontal: 20, marginBottom: 12,
  },

  // Visit card
  visitCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderRadius: 16, marginHorizontal: 20, marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#1A6FBF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  visitAccent: { width: 4 },
  visitContent: { flex: 1, padding: 14 },
  visitTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  visitService: { fontSize: 14, fontWeight: '600', color: '#1A2A3A', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  visitDetails: { gap: 6 },
  visitDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  visitDetailIcon: { fontSize: 13 },
  visitDetailText: { fontSize: 12, color: '#5A7A9A' },
  jobId: { fontSize: 11, color: '#9AB0C4', marginTop: 8 },

  // Empty
  emptyState: {
    alignItems: 'center', paddingVertical: 40,
    marginHorizontal: 20, backgroundColor: '#FFFFFF',
    borderRadius: 16, borderWidth: 1, borderColor: '#C8D9EC',
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#9AB0C4' },
});