import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JobDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Job Detail</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.jobId}>#{id}</Text>
                <Text style={styles.coming}>Full detail screen coming soon</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#EAF3FB' },
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
    title: { fontSize: 20, fontWeight: '700', color: '#1A2A3A' },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    jobId: { fontSize: 22, fontWeight: '700', color: '#1A6FBF', marginBottom: 8 },
    coming: { fontSize: 14, color: '#5A7A9A' },
});