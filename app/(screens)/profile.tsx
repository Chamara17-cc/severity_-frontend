import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    district: string;
    city: string;
    address: string;
    avatarInitials: string;
};

// ─── Stub Data ────────────────────────────────────────────────────────────────

const STUB_PROFILE: ProfileData = {
    firstName: 'Kasun',
    lastName: 'Perera',
    email: 'kasun@gmail.com',
    phone: '+94 771 234 567',
    district: 'Colombo',
    city: 'Nugegoda',
    address: '42/A, Temple Road',
    avatarInitials: 'KP',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
    const router = useRouter();
    const [profile] = useState<ProfileData>(STUB_PROFILE);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // TODO: Replace with real API call
    // GET /api/customer/profile
    // Headers: { Authorization: `Bearer ${accessToken}` }
    // Response: { profile: ProfileData }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: call authStore.logout()
                        // TODO: clear AsyncStorage token
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#EAF3FB" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Account</Text>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => router.push('/(screens)/edit-profile')}
                    >
                        <Text style={styles.editBtnText}>✏️ Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Avatar & Name */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{profile.avatarInitials}</Text>
                    </View>
                    <Text style={styles.fullName}>{profile.firstName} {profile.lastName}</Text>
                    <Text style={styles.emailText}>{profile.email}</Text>
                    <View style={styles.phoneBadge}>
                        <Text style={styles.phoneText}>📱 {profile.phone}</Text>
                    </View>
                </View>

                {/* Personal Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>
                    <View style={styles.card}>
                        <DetailRow icon="👤" label="First Name" value={profile.firstName} />
                        <Divider />
                        <DetailRow icon="👤" label="Last Name" value={profile.lastName} />
                        <Divider />
                        <DetailRow icon="📧" label="Email" value={profile.email} />
                        <Divider />
                        <DetailRow icon="📱" label="Mobile" value={profile.phone} />
                    </View>
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Address</Text>
                    <View style={styles.card}>
                        <DetailRow icon="🏙️" label="District" value={profile.district} />
                        <Divider />
                        <DetailRow icon="🏘️" label="City / Town" value={profile.city} />
                        <Divider />
                        <DetailRow icon="🏠" label="Street Address" value={profile.address} />
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.card}>
                        <ToggleRow
                            icon="🔔"
                            label="Notifications"
                            value={notificationsEnabled}
                            onToggle={setNotificationsEnabled}
                        />
                        <Divider />
                        <ToggleRow
                            icon="🌙"
                            label="Dark Theme"
                            value={isDarkTheme}
                            onToggle={setIsDarkTheme}
                        />
                        <Divider />
                        <MenuRow
                            icon="🌐"
                            label="Language"
                            value="English"
                            onPress={() => Alert.alert('Language', 'Language selection coming soon')}
                        />
                    </View>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.card}>
                        <MenuRow
                            icon="👥"
                            label="Invite Friends"
                            onPress={() => Alert.alert('Invite', 'Invite friends coming soon')}
                        />
                        <Divider />
                        {/* <MenuRow
              icon="📋"
              label="Terms and Conditions"
              onPress={() => router.push('/(screens)/terms')}
            /> */}
                        <Divider />
                        {/* <MenuRow
              icon="🔒"
              label="Privacy Policy"
              onPress={() => router.push('/(screens)/privacy')}
            /> */}
                        <Divider />
                        {/* <MenuRow
              icon="🔑"
              label="Change Password"
              onPress={() => router.push('/(screens)/change-password')}
            /> */}
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.copyright}>© Servicely.lk 2025</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View style={styles.row}>
            <View style={styles.rowIconBox}>
                <Text style={styles.rowIcon}>{icon}</Text>
            </View>
            <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue}>{value}</Text>
            </View>
        </View>
    );
}

function ToggleRow({ icon, label, value, onToggle }: {
    icon: string; label: string; value: boolean; onToggle: (v: boolean) => void;
}) {
    return (
        <View style={styles.row}>
            <View style={styles.rowIconBox}>
                <Text style={styles.rowIcon}>{icon}</Text>
            </View>
            <Text style={[styles.rowValue, { flex: 1 }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#C8D9EC', true: '#1A6FBF' }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
}

function MenuRow({ icon, label, value, onPress }: {
    icon: string; label: string; value?: string; onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.rowIconBox}>
                <Text style={styles.rowIcon}>{icon}</Text>
            </View>
            <Text style={[styles.rowValue, { flex: 1 }]}>{label}</Text>
            {value && <Text style={styles.rowMeta}>{value}</Text>}
            <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#EAF3FB' },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A2A3A', letterSpacing: -0.3 },
    editBtn: {
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, backgroundColor: '#FFFFFF',
        borderWidth: 1, borderColor: '#C8D9EC',
    },
    editBtnText: { fontSize: 13, color: '#1A6FBF', fontWeight: '500' },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 28,
    },
    avatar: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#1A6FBF',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#1A6FBF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
    fullName: { fontSize: 20, fontWeight: '700', color: '#1A2A3A', marginBottom: 4 },
    emailText: { fontSize: 13, color: '#5A7A9A', marginBottom: 10 },
    phoneBadge: {
        paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, backgroundColor: '#FFFFFF',
        borderWidth: 1, borderColor: '#C8D9EC',
    },
    phoneText: { fontSize: 13, color: '#1A2A3A', fontWeight: '500' },

    // Section
    section: { marginBottom: 16, paddingHorizontal: 20 },
    sectionTitle: {
        fontSize: 13, fontWeight: '600', color: '#5A7A9A',
        marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 16,
        shadowColor: '#1A6FBF', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
        overflow: 'hidden',
    },

    // Row
    row: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    },
    rowIconBox: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#EAF3FB',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    rowIcon: { fontSize: 16 },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 11, color: '#9AB0C4', marginBottom: 2 },
    rowValue: { fontSize: 14, color: '#1A2A3A', fontWeight: '500' },
    rowMeta: { fontSize: 13, color: '#5A7A9A', marginRight: 4 },
    rowChevron: { fontSize: 20, color: '#C8D9EC', fontWeight: '300' },
    divider: { height: 1, backgroundColor: '#F0F5FA', marginLeft: 64 },

    // Logout
    logoutBtn: {
        marginHorizontal: 20, marginTop: 8, marginBottom: 8,
        height: 52, borderRadius: 14,
        backgroundColor: '#FCEBEB',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#F5C6C6',
    },
    logoutText: { fontSize: 15, fontWeight: '600', color: '#D94040' },

    // Copyright
    copyright: {
        textAlign: 'center', fontSize: 11,
        color: '#9AB0C4', marginTop: 8,
    },
});