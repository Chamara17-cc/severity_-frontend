import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/constants/colors';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const router = useRouter();
  const { email, phone, mode } = useLocalSearchParams<{ email?: string; phone?: string; mode?: string }>();
  const destination = email ?? phone ?? 'your contact';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { Alert.alert('Incomplete', 'Please enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      router.replace('/(auth)/login');
    } catch (err: any) {
      Alert.alert('Invalid code', err?.message ?? 'The code is incorrect or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setTimer(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputs.current[0]?.focus();
    Alert.alert('Sent', 'A new code has been sent');
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.brandName}>⚙️ Servicely.lk</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>📱</Text>
        </View>
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.desc}>
          Enter the 6-digit code we sent to{'\n'}
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>{destination}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => { inputs.current[i] = ref; }}
              style={[styles.otpBox, digit ? styles.otpFilled : undefined]}
              value={digit}
              onChangeText={text => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendActive}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend in{' '}
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </Text>
            </Text>
          )}
        </View>

        <Button
          label={loading ? 'Verifying...' : 'Verify Code'}
          onPress={handleVerify}
          loading={loading}
          disabled={otp.join('').length < OTP_LENGTH}
        />
      </View>
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
  center: { alignItems: 'center', paddingVertical: 32 },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primaryFaint,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  iconEmoji: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: 10 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 24,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 4,
  },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  otpBox: {
    flex: 1, height: 54, borderRadius: 12, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.inputBg,
    fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
  },
  otpFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryFaint },
  resendRow: { alignItems: 'center', marginBottom: 20 },
  timerText: { fontSize: 13, color: Colors.textSecondary },
  resendActive: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});