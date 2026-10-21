import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  phoneConfirmed: boolean;
  username: string | null;
}

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const clean = username.trim().toLowerCase();
  if (clean.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long.' };
  }
  if (clean.length > 20) {
    return { isValid: false, error: 'Username cannot exceed 20 characters.' };
  }
  if (!USERNAME_REGEX.test(clean)) {
    return {
      isValid: false,
      error: 'Username can only contain lowercase letters, numbers, and underscores.',
    };
  }
  return { isValid: true };
}

/**
 * Checks if a username is available (unique) in the profiles table.
 */
export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  const clean = username.trim().toLowerCase();
  const validation = validateUsername(clean);
  if (!validation.isValid) return false;

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('profiles').select('id').eq('username', clean);
      if (excludeUserId) {
        query = query.neq('id', excludeUserId);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error checking username uniqueness:', error);
        return true;
      }
      return !data || data.length === 0;
    } catch (e) {
      console.warn('Supabase username check error:', e);
      return true;
    }
  }

  // Local validation
  const reservedUsernames = ['admin', 'system', 'twin', 'support', 'help'];
  if (reservedUsernames.includes(clean)) return false;
  return true;
}

/**
 * Sends a phone OTP verification code via Supabase Auth SMS provider.
 */
export async function sendPhoneOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  // E.164 phone normalization
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  if (!cleanPhone.startsWith('+') || cleanPhone.length < 9) {
    return {
      success: false,
      error: 'Please enter a valid international mobile number in E.164 format (e.g. +966501234567).',
    };
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP.' };
    }
  }

  // Simulation mode (for evaluation when live SMS provider is unconfigured)
  return { success: true };
}

/**
 * Verifies a 4-digit or 6-digit phone OTP token.
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  const cleanToken = token.trim();

  if (cleanToken.length < 4) {
    return { success: false, error: 'Verification code must be at least 4 digits.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: cleanToken,
        type: 'sms',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, userId: data.user?.id };
    } catch (err: any) {
      return { success: false, error: err.message || 'OTP verification failed.' };
    }
  }

  // Simulation mode: demo code '1234' or any valid 4+ digit code
  if (cleanToken === '1234' || cleanToken.length >= 4) {
    return { success: true, userId: 'usr_me' };
  }

  return { success: false, error: 'Invalid verification code. Please check and try again.' };
}

/**
 * Signs out the current user and clears session state.
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out of Supabase:', e);
    }
  }
}
