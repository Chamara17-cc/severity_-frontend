import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OFFERS = [
  { id: '1', badge: 'LIMITED', text: '50% off your first plumbing job', icon: '🔧' },
  { id: '2', badge: 'SAVE', text: 'LKR 500 off on 2nd booking', icon: '🏷️' },
  { id: '3', badge: 'FREE', text: 'Free inspection this weekend', icon: '🔍' },
];

const POPULAR_SERVICES = [
  { id: '1', name: 'Electrical & Wiring', icon: '⚡', requests: 324, bg: '#EAF3FB', route: '/(screens)/jobs/create' },
  { id: '2', name: 'Plumbing & Fitting', icon: '🔧', requests: 289, bg: '#E1F5EE', route: '/(screens)/jobs/create' },
  { id: '3', name: 'AC Repair', icon: '❄️', requests: 218, bg: '#E1F5EE', route: '/(screens)/jobs/create' },
  { id: '4', name: 'Painting & Finishing', icon: '🎨', requests: 197, bg: '#FAEEDA', route: '/(screens)/jobs/create' },
  { id: '5', name: 'CCTV Setup', icon: '📷', requests: 154, bg: '#FAECE7', route: '/(screens)/jobs/create' },
  { id: '6', name: 'IT & Networking', icon: '💻', requests: 132, bg: '#EAF3FB', route: '/(screens)/jobs/create' },
];

const STATS = [
  { value: '2,400+', label: 'Jobs Done' },
  { value: '180+', label: 'Pros on Board' },
  { value: '4.8 ⭐', label: 'Avg Rating' },
];

export default function HomeScreen() {
  const router = useRouter();
  // Replace with real user from your auth context
  const userName = 'Kasun';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A4A8A" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Decorative circles */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.brand}>
              <View style={styles.brandIconBox}>
                <Text style={styles.brandIconText}>⚙️</Text>
              </View>
              <View>
                <Text style={styles.brandName}>Servicely.lk</Text>
                <Text style={styles.brandSub}>Service at Your Fingertips</Text>
              </View>
            </View>
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.iconPill}
                onPress={() => router.push('/(screens)/notifications')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconPillText}>🔔</Text>
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconPill}
                onPress={() => router.push('/(screens)/profile')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconPillText}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting + headline */}
          <Text style={styles.greeting}>{getGreeting()}, {userName} 👋</Text>
          <Text style={styles.headline}>
            What service do you{'\n'}
            <Text style={styles.headlineAccent}>need today?</Text>
          </Text>

          {/* Main CTA */}
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/(screens)/jobs/services')}
            activeOpacity={0.9}
          >
            <View style={styles.ctaLeft}>
              <View style={styles.ctaIconBox}>
                <Text style={styles.ctaIconText}>🛠️</Text>
              </View>
              <View>
                <Text style={styles.ctaLabel}>Request a Service</Text>
                <Text style={styles.ctaSublabel}>Describe your job — we'll handle the rest</Text>
              </View>
            </View>
            <View style={styles.ctaArrow}>
              <Text style={styles.ctaArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Quick access cards (floating) ── */}
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={[styles.miniCard, styles.miniCardTeal]}
            onPress={() => router.push('/(screens)/joblist')}
            activeOpacity={0.85}
          >
            <View style={[styles.miniIconBox, { backgroundColor: '#E1F5EE' }]}>
              <Text style={styles.miniIconText}>📋</Text>
            </View>
            <Text style={styles.miniCardLabel}>My Jobs</Text>
            <Text style={styles.miniCardSub}>Track & review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniCard, styles.miniCardAmber]}
            onPress={() => router.push('/(screens)/calender')}
            activeOpacity={0.85}
          >
            <View style={[styles.miniIconBox, { backgroundColor: '#FAEEDA' }]}>
              <Text style={styles.miniIconText}>📅</Text>
            </View>
            <Text style={styles.miniCardLabel}>Schedule</Text>
            <Text style={styles.miniCardSub}>Upcoming visits</Text>
          </TouchableOpacity>
        </View>

        {/* ── Trust stats ── */}
        <View style={styles.statBand}>
          {STATS.map((stat, i) => (
            <View key={i} style={[styles.statItem, i > 0 && styles.statBorder]}>
              <Text style={styles.statNum}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Offers ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers for you</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersRow}
          >
            {OFFERS.map(offer => (
              <TouchableOpacity key={offer.id} style={styles.offerCard} activeOpacity={0.8}>
                <Text style={styles.offerEmoji}>{offer.icon}</Text>
                <View>
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                  </View>
                  <Text style={styles.offerText}>{offer.text}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Popular Services ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular services</Text>
            <TouchableOpacity onPress={() => router.push('/(screens)/jobs/services')}>
              <Text style={styles.sectionLink}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {POPULAR_SERVICES.map(service => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(service.route as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.svcIconBox, { backgroundColor: service.bg }]}>
                  <Text style={styles.svcIcon}>{service.icon}</Text>
                </View>
                <View>
                  <Text style={styles.svcName}>{service.name}</Text>
                  <Text style={styles.svcReq}>{service.requests} requests</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EAF3FB',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // ── Hero ──
  hero: {
    backgroundColor: '#1A6FBF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 52,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -40, right: -40,
    width: 160, height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -20, left: 30,
    width: 90, height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIconBox: {
    width: 34, height: 34,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  brandIconText: { fontSize: 16 },
  brandName: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  brandSub: { fontSize: 10, color: 'rgba(255,255,255,0.65)' },
  topActions: { flexDirection: 'row', gap: 8 },
  iconPill: {
    width: 34, height: 34,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  iconPillText: { fontSize: 15 },
  notifDot: {
    position: 'absolute', top: 5, right: 5,
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: '#FAC775',
    borderWidth: 1.5,
    borderColor: '#1A6FBF',
  },

  // Greeting
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 2 },
  headline: { fontSize: 20, fontWeight: '700', color: '#fff', lineHeight: 26, marginBottom: 18 },
  headlineAccent: { color: '#9FE1CB' },

  // CTA button
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  ctaIconBox: {
    width: 40, height: 40,
    backgroundColor: '#EAF3FB',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaIconText: { fontSize: 20 },
  ctaLabel: { fontSize: 14, fontWeight: '700', color: '#0F1C2E' },
  ctaSublabel: { fontSize: 11, color: '#5A7A9A', marginTop: 1 },
  ctaArrow: {
    width: 34, height: 34,
    backgroundColor: '#1A6FBF',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaArrowText: { fontSize: 16, color: '#fff', fontWeight: '600' },

  // ── Quick cards ──
  cardGroup: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -28,
    gap: 10,
    zIndex: 2,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.15)',
  },
  miniCardTeal: {},
  miniCardAmber: {},
  miniIconBox: {
    width: 36, height: 36,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  miniIconText: { fontSize: 18 },
  miniCardLabel: { fontSize: 12, fontWeight: '700', color: '#0F1C2E' },
  miniCardSub: { fontSize: 10, color: '#5A7A9A', marginTop: 1 },

  // ── Stat band ──
  statBand: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.15)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(26,111,191,0.15)',
  },
  statNum: { fontSize: 18, fontWeight: '700', color: '#1A6FBF' },
  statLabel: { fontSize: 10, color: '#5A7A9A', marginTop: 2 },

  // ── Sections ──
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F1C2E', marginBottom: 12 },
  sectionLink: { fontSize: 12, color: '#1A6FBF', fontWeight: '600' },

  // Offers
  offersRow: { gap: 10 },
  offerCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.15)',
  },
  offerEmoji: { fontSize: 20 },
  offerBadge: {
    backgroundColor: '#FAECE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  offerBadgeText: { fontSize: 9, fontWeight: '700', color: '#D85A30' },
  offerText: { fontSize: 11, color: '#0F1C2E', fontWeight: '500', lineHeight: 15 },

  // Services
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(26,111,191,0.15)',
  },
  svcIconBox: {
    width: 38, height: 38,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  svcIcon: { fontSize: 18 },
  svcName: { fontSize: 12, fontWeight: '600', color: '#0F1C2E', lineHeight: 16 },
  svcReq: { fontSize: 10, color: '#5A7A9A', marginTop: 2 },
});