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

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType =
  | 'job_confirmation'
  | 'sp_assigned'
  | 'sp_arrival'
  | 'revisit_approved'
  | 'rerequest_status'
  | 'payment_success'
  | 'payment_failed'
  | 'warranty_expiry';

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;   // e.g. "2 hours ago"
  read: boolean;
  jobId?: string;
};

// ─── Stub Data ────────────────────────────────────────────────────────────────

const STUB_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'sp_assigned', read: false,
    title: 'SP Assigned',
    message: 'Kasun Perera has been assigned to your Electrical & Wiring job.',
    time: '10 min ago', jobId: 'JOB-001',
  },
  {
    id: '2', type: 'sp_arrival', read: false,
    title: 'SP On the Way',
    message: 'Your verification code is 4782. Show this to Kasun when he arrives.',
    time: '25 min ago', jobId: 'JOB-001',
  },
  {
    id: '3', type: 'payment_success', read: false,
    title: 'Payment Successful',
    message: 'Payment of LKR 3,500 for JOB-002 was successful.',
    time: '2 hours ago', jobId: 'JOB-002',
  },
  {
    id: '4', type: 'revisit_approved', read: true,
    title: 'Revisit Approved',
    message: 'Your revisit request for JOB-003 has been approved. Scheduled for May 20.',
    time: 'Yesterday', jobId: 'JOB-003',
  },
  {
    id: '5', type: 'job_confirmation', read: true,
    title: 'Job Confirmed',
    message: 'Your job request JOB-004 has been confirmed and is under review.',
    time: '2 days ago', jobId: 'JOB-004',
  },
  {
    id: '6', type: 'warranty_expiry', read: true,
    title: 'Warranty Expiring Soon',
    message: 'The warranty for JOB-001 (Electrical & Wiring) expires in 7 days.',
    time: '3 days ago', jobId: 'JOB-001',
  },
  {
    id: '7', type: 'payment_failed', read: true,
    title: 'Payment Failed',
    message: 'Payment for JOB-005 failed. Please try again.',
    time: '4 days ago', jobId: 'JOB-005',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const NOTIF_CONFIG: Record<NotifType, { icon: string; color: string; bg: string }> = {
  job_confirmation: { icon: '✅', color: '#2E9E6B', bg: '#E6F7EF' },
  sp_assigned: { icon: '👷', color: '#1A6FBF', bg: '#E8F2FB' },
  sp_arrival: { icon: '🔑', color: '#7C3AED', bg: '#EDE9FE' },
  revisit_approved: { icon: '🔄', color: '#D97706', bg: '#FEF3C7' },
  rerequest_status: { icon: '📋', color: '#1A6FBF', bg: '#E8F2FB' },
  payment_success: { icon: '💳', color: '#2E9E6B', bg: '#E6F7EF' },
  payment_failed: { icon: '⚠️', color: '#D94040', bg: '#FCEBEB' },
  warranty_expiry: { icon: '🛡️', color: '#D97706', bg: '#FEF3C7' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(STUB_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // TODO: Replace with real API call
  // GET /api/customer/notifications
  // Headers: { Authorization: `Bearer ${accessToken}` }
  // Response: { notifications: Notification[] }
  const fetchNotifications = async () => {
    setRefreshing(true);
    try {
      // const response = await fetch(`${API_BASE_URL}/api/customer/notifications`, {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      // const data = await response.json();
      // setNotifications(data.notifications);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // TODO: Replace with real API call
  // PUT /api/customer/notifications/{id}/read
  // Headers: { Authorization: `Bearer ${accessToken}` }
  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    // await fetch(`${API_BASE_URL}/api/customer/notifications/${id}/read`, {
    //   method: 'PUT',
    //   headers: { Authorization: `Bearer ${accessToken}` }
    // });
  };

  // TODO: Replace with real API call
  // PUT /api/customer/notifications/read-all
  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // await fetch(`${API_BASE_URL}/api/customer/notifications/read-all`, {
    //   method: 'PUT',
    //   headers: { Authorization: `Bearer ${accessToken}` }
    // });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleNotifPress = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.jobId) {
      router.push(`/(screens)/${notif.jobId}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF3FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} colors={['#1A6FBF']} />
        }
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>No unread notifications</Text>
          </View>
        ) : (
          filtered.map(notif => {
            const config = NOTIF_CONFIG[notif.type];
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => handleNotifPress(notif)}
                activeOpacity={0.85}
              >
                {/* Unread dot */}
                {!notif.read && <View style={styles.unreadDot} />}

                {/* Icon */}
                <View style={[styles.notifIconBox, { backgroundColor: config.bg }]}>
                  <Text style={styles.notifIconText}>{config.icon}</Text>
                </View>

                {/* Content */}
                <View style={styles.notifContent}>
                  <View style={styles.notifTopRow}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  {notif.jobId && (
                    <Text style={styles.notifJobId}>#{notif.jobId}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EAF3FB' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C8D9EC',
  },
  backArrow: { fontSize: 18, color: '#1A2A3A' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A2A3A' },
  unreadBadge: {
    backgroundColor: '#D94040', borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  unreadBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  markAllText: { fontSize: 12, color: '#1A6FBF', fontWeight: '500' },

  // Filter
  filterRow: {
    flexDirection: 'row', marginHorizontal: 20,
    marginBottom: 16, gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#C8D9EC',
  },
  filterTabActive: { backgroundColor: '#1A6FBF', borderColor: '#1A6FBF' },
  filterTabText: { fontSize: 13, color: '#5A7A9A', fontWeight: '500' },
  filterTabTextActive: { color: '#FFFFFF', fontWeight: '600' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Notif card
  notifCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 14, padding: 14,
    alignItems: 'flex-start', gap: 12,
    shadowColor: '#1A6FBF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    position: 'relative',
  },
  notifCardUnread: {
    borderLeftWidth: 3, borderLeftColor: '#1A6FBF',
  },
  unreadDot: {
    position: 'absolute', top: 14, right: 14,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#1A6FBF',
  },
  notifIconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  notifIconText: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 4,
  },
  notifTitle: { fontSize: 13, fontWeight: '600', color: '#1A2A3A', flex: 1, marginRight: 8 },
  notifTime: { fontSize: 11, color: '#9AB0C4' },
  notifMessage: { fontSize: 12, color: '#5A7A9A', lineHeight: 18 },
  notifJobId: { fontSize: 11, color: '#9AB0C4', marginTop: 4 },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1A2A3A', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9AB0C4' },
});