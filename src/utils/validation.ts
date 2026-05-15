export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPhone = (value: string): boolean =>
  /^(\+94|0)[0-9]{9}$/.test(value.trim().replace(/\s/g, ''));

export const isEmailOrPhone = (value: string): boolean =>
  isValidEmail(value) || isValidPhone(value);

export const isStrongPassword = (password: string): boolean =>
  password.length >= 8;

export const getPasswordStrength = (password: string): 'weak' | 'fair' | 'strong' => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score <= 2) return 'fair';
  return 'strong';
};

export const validateRegister = (data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.firstName.trim()) errors.firstName = 'First name is required';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required';
  if (!isValidPhone(data.phone)) errors.phone = 'Enter a valid Sri Lankan phone number';
  if (!isValidEmail(data.email)) errors.email = 'Enter a valid email address';
  if (!isStrongPassword(data.password)) errors.password = 'Password must be at least 8 characters';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if (!data.agreedToTerms) errors.terms = 'You must agree to the terms and conditions';

  return errors;
};
