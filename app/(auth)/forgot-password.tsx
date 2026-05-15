import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Colors } from '../../src/constants/colors';
import { isEmailOrPhone } from '../../src/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!emailOrPhone.trim()) { setError('Please enter your email or phone number'); return; }
    if (!isEmailOrPhone(emailOrPhone)) { setError('Enter a valid email address or phone number'); return; }
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not send reset link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brandName}>⚙️ Servicely.lk</Text>
      </View>

      {!sent ? (
        <>
          <View style={styles.center}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.desc}>
              Enter your registered email or mobile number and we'll send you a reset link.
            </Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Email or Mobile Number"
              placeholder="Enter your email or phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              error={error}
              keyboardType="email-address"
              required
            />
            <Button label="Send Reset Link" onPress={handleSend} loading={loading} style={styles.btn} />
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: '#E6F7EF' }]}>
            <Text style={styles.iconEmoji}>✅</Text>
          </View>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.desc}>
            We've sent a reset link to{'\n'}
            <Text style={{ color: Colors.primary, fontWeight: '600' }}>{emailOrPhone}</Text>
          </Text>
          <Button label="Back to Login" onPress={() => router.replace('/(auth)/login')} style={styles.btn} />
          <Button label="Resend Link" onPress={() => { setSent(false); setEmailOrPhone(''); }}
            variant="outline" style={{ ...styles.btn, marginTop: 12 }} />
        </View>
      )}

      {!sent && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 32, paddingBottom: 8 },
  backBtn: {
    marginBottom: 16, width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  backArrow: { fontSize: 18, color: Colors.textPrimary, lineHeight: 20 },
  brandName: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  center: { alignItems: 'center', paddingVertical: 36 },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primaryFaint,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  iconEmoji: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21, paddingHorizontal: 16 },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 24,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 4,
  },
  btn: { marginTop: 24, width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});