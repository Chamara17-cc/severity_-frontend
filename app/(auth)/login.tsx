// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, Alert, ScrollView, KeyboardAvoidingView,
//   Platform, SafeAreaView, ActivityIndicator
// } from 'react-native';

// export default function LoginScreen() {
//   const router = useRouter();
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!emailOrPhone || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }
//     setLoading(true);
//     await new Promise(r => setTimeout(r, 1200));
//     setLoading(false);
//     Alert.alert('Success', 'Login stub works!');
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
//           <View style={styles.logoArea}>
//             <View style={styles.logoBox}>
//               <Text style={styles.logoEmoji}>⚙️</Text>
//             </View>
//             <Text style={styles.brandName}>Servicely.lk</Text>
//             <Text style={styles.tagline}>Service at Your Fingertips</Text>
//           </View>
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Welcome back</Text>
//             <Text style={styles.cardSubtitle}>Sign in to your account</Text>
//             <Text style={styles.label}>Email or Mobile Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email or phone"
//               placeholderTextColor="#9AB0C4"
//               value={emailOrPhone}
//               onChangeText={setEmailOrPhone}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your password"
//               placeholderTextColor="#9AB0C4"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />
//             <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotLink}>
//               <Text style={styles.forgotText}>Forgot password?</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading} activeOpacity={0.82}>
//               {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
//             </TouchableOpacity>
//           </View>
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
//               <Text style={styles.footerLink}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.copyright}>© Servicely.lk 2025</Text>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#F4F8FC' },
//   scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
//   logoArea: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
//   logoBox: {
//     width: 72, height: 72, borderRadius: 20, backgroundColor: '#1A6FBF',
//     alignItems: 'center', justifyContent: 'center', marginBottom: 12,
//     shadowColor: '#1A6FBF', shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
//   },
//   logoEmoji: { fontSize: 36 },
//   brandName: { fontSize: 22, fontWeight: '700', color: '#1A6FBF', letterSpacing: -0.3 },
//   tagline: { fontSize: 13, color: '#5A7A9A', marginTop: 4 },
//   card: {
//     backgroundColor: '#fff', borderRadius: 20, padding: 24,
//     shadowColor: '#1A6FBF', shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1, shadowRadius: 20, elevation: 4,
//   },
//   cardTitle: { fontSize: 20, fontWeight: '700', color: '#1A2A3A', marginBottom: 4 },
//   cardSubtitle: { fontSize: 13, color: '#5A7A9A', marginBottom: 24 },
//   label: { fontSize: 13, fontWeight: '500', color: '#5A7A9A', marginBottom: 6 },
//   input: {
//     height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#C8D9EC',
//     backgroundColor: '#F0F5FA', paddingHorizontal: 14, fontSize: 14,
//     color: '#1A2A3A', marginBottom: 14,
//   },
//   forgotLink: { alignSelf: 'flex-end', marginTop: -6, marginBottom: 20 },
//   forgotText: { fontSize: 13, color: '#1A6FBF', fontWeight: '500' },
//   btn: {
//     height: 50, borderRadius: 12, backgroundColor: '#1A6FBF',
//     alignItems: 'center', justifyContent: 'center', marginTop: 4,
//   },
//   btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
//   footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
//   footerText: { fontSize: 14, color: '#5A7A9A' },
//   footerLink: { fontSize: 14, fontWeight: '600', color: '#1A6FBF' },
//   copyright: { textAlign: 'center', fontSize: 11, color: '#9AB0C4', marginTop: 32 },
// });

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { isEmailOrPhone } from '../../src/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or mobile number is required';
    } else if (!isEmailOrPhone(emailOrPhone)) {
      newErrors.emailOrPhone = 'Enter a valid email or phone number';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      if (emailOrPhone === 'test@gmail.com' && password === 'chmr1234') {
        router.replace('/(pages)');
      } else {
        Alert.alert('Login failed', 'Invalid email or password');
      }
    } catch (err: any) {
      Alert.alert('Login failed', err?.message ?? 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.logoArea}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>⚙️</Text>
        </View>
        <Text style={styles.brandName}>Servicely.lk</Text>
        <Text style={styles.tagline}>Service at Your Fingertips</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>Sign in to your account</Text>

        <Input
          label="Email or Mobile Number"
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          error={errors.emailOrPhone}
          keyboardType="email-address"
          required
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          isPassword
          required
        />

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotLink}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button label="Login" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>© Servicely.lk 2025</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logoArea: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  logoEmoji: { fontSize: 36 },
  brandName: { fontSize: 22, fontWeight: '700', color: Colors.primary, letterSpacing: -0.3 },
  tagline: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 24,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 24 },
  forgotLink: { alignSelf: 'flex-end', marginTop: -6, marginBottom: 20 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  loginBtn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  copyright: { textAlign: 'center', fontSize: 11, color: Colors.textHint, marginTop: 32 },
});