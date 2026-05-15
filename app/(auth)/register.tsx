import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { Colors } from '../../src/constants/colors';
import { validateRegister } from '../../src/utils/validation';

type FormData = {
  firstName: string; lastName: string; dateOfBirth: string;
  district: string; city: string; address: string;
  phone: string; email: string;
  password: string; confirmPassword: string;
  agreedToTerms: boolean;
};

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', dateOfBirth: '',
    district: '', city: '', address: '',
    phone: '', email: '', password: '', confirmPassword: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'terms', string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as any);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      router.push({ pathname: '/(auth)/otp', params: { email: form.email, phone: form.phone, mode: 'verify' } });
    } catch (err: any) {
      Alert.alert('Registration failed', err?.message ?? 'Please try again');
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
        <Text style={styles.pageTitle}>Create Account</Text>
        <Text style={styles.pageSubtitle}>Fill in your details to get started</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.half}>
            <Input label="First Name" placeholder="First Name" value={form.firstName}
              onChangeText={set('firstName')} error={errors.firstName} required />
          </View>
          <View style={styles.half}>
            <Input label="Last Name" placeholder="Last Name" value={form.lastName}
              onChangeText={set('lastName')} error={errors.lastName} required />
          </View>
        </View>

        <Input label="Date of Birth" placeholder="DD / MM / YYYY" value={form.dateOfBirth}
          onChangeText={set('dateOfBirth')} keyboardType="numeric" />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input label="District" placeholder="District" value={form.district}
              onChangeText={set('district')} />
          </View>
          <View style={styles.half}>
            <Input label="City / Town" placeholder="City or Town" value={form.city}
              onChangeText={set('city')} />
          </View>
        </View>

        <Input label="Street Address" placeholder="Apt No / Street Name"
          value={form.address} onChangeText={set('address')} />

        <Input label="Mobile Number" placeholder="+94 7X XXX XXXX" value={form.phone}
          onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" required />

        <Input label="Email Address" placeholder="Enter your email" value={form.email}
          onChangeText={set('email')} error={errors.email} keyboardType="email-address" required />

        <Input label="Password" placeholder="Enter your password" value={form.password}
          onChangeText={set('password')} error={errors.password} isPassword required />

        <Input label="Confirm Password" placeholder="Confirm your password" value={form.confirmPassword}
          onChangeText={set('confirmPassword')} error={errors.confirmPassword} isPassword required />

        <TouchableOpacity style={styles.termsRow}
          onPress={() => set('agreedToTerms')(!form.agreedToTerms)} activeOpacity={0.7}>
          <View style={[styles.checkbox, form.agreedToTerms && styles.checkboxChecked]}>
            {form.agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I have read and agree to the{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {errors.terms && <Text style={styles.termsError}>{errors.terms}</Text>}

        <Button label="Submit Application" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>© Servicely.lk 2025</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 32, paddingBottom: 24 },
  backBtn: {
    marginBottom: 16, width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  backArrow: { fontSize: 18, color: Colors.textPrimary, lineHeight: 20 },
  brandName: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.3 },
  pageSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 4,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 8, marginBottom: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.inputBg,
    alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  termsText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: '500' },
  termsError: { fontSize: 11, color: Colors.error, marginBottom: 8 },
  submitBtn: { marginTop: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  copyright: { textAlign: 'center', fontSize: 11, color: Colors.textHint, marginTop: 32 },
});