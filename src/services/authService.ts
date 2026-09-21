import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import {
  sendWelcomeAndConfirmationEmail,
  sendPasswordResetCodeEmail,
  sendAdminInvitationEmail,
  verifyEmailCode,
} from './emailService';

export type AdminRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'content_manager' 
  | 'marketplace_manager' 
  | 'support_admin' 
  | 'support';

export type AdminTabPermission = 
  | 'orders' 
  | 'products' 
  | 'categories' 
  | 'coupons' 
  | 'blogs' 
  | 'subscribers' 
  | 'messages' 
  | 'analytics' 
  | 'settings' 
  | 'team';

export const ROLE_DEFAULT_PERMISSIONS: Record<AdminRole, AdminTabPermission[]> = {
  super_admin: ['orders', 'products', 'categories', 'coupons', 'blogs', 'subscribers', 'messages', 'analytics', 'settings', 'team'],
  admin: ['orders', 'products', 'categories', 'coupons', 'blogs', 'subscribers', 'messages', 'analytics', 'settings'],
  marketplace_manager: ['orders', 'products', 'categories', 'coupons', 'analytics'],
  content_manager: ['blogs', 'subscribers', 'messages', 'analytics'],
  support_admin: ['orders', 'messages', 'subscribers'],
  support: ['orders', 'messages', 'subscribers'],
  manager: ['orders', 'products', 'categories', 'coupons', 'blogs', 'subscribers', 'messages', 'analytics'],
};

export const ROLE_DISPLAY_NAMES: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Full Administrator',
  marketplace_manager: 'Marketplace Manager',
  content_manager: 'Content Manager',
  support_admin: 'Support Specialist',
  support: 'Support Specialist',
  manager: 'General Manager',
};

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName?: string;
  role?: AdminRole | 'user';
  createdAt?: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isSuperAdmin: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  permissions?: AdminTabPermission[];
}

// Master Super Administrator Credentials & Metadata
export const SUPER_ADMIN_EMAIL = 'akmahdi085@gmail.com';
export const SUPER_ADMIN_NAME = 'ElMahdi Ak';
export const SUPER_ADMIN_DEFAULT_PASS = 'AbtalAdmin2026!#Quest';

/**
 * Check whether a user is strictly the primary Super Administrator
 * SECURITY RULE: Full Super Admin privileges are restricted strictly to akmahdi085@gmail.com.
 * No other email or spoofed metadata can ever claim Super Admin rights.
 */
export const isSuperAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};

/**
 * Sign in user with email and password via Supabase Auth or local verified credentials
 */
export const signInUser = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const isSuperAdminTarget = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Check custom/updated credentials from password reset first
  try {
    const credsRaw = localStorage.getItem('abtalquest_admin_credentials');
    if (credsRaw) {
      const creds = JSON.parse(credsRaw);
      if (creds[normalizedEmail] && creds[normalizedEmail].password === password) {
        const appointedUser = {
          id: isSuperAdminTarget
            ? '39f9b51f-63c8-4448-bc2c-e6898163616c'
            : `admin-${normalizedEmail}`,
          email: normalizedEmail,
          user_metadata: {
            full_name: creds[normalizedEmail].fullName || (isSuperAdminTarget ? SUPER_ADMIN_NAME : normalizedEmail.split('@')[0]),
            role: creds[normalizedEmail].role || (isSuperAdminTarget ? 'super_admin' : 'admin'),
            is_super_admin: isSuperAdminTarget,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User;

        localStorage.setItem('abtalquest_active_admin', JSON.stringify(appointedUser));
        return { user: appointedUser, error: null };
      }
    }
  } catch {
    // Continue
  }

  // Check registered standard users
  try {
    const usersRaw = localStorage.getItem('abtalquest_registered_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      if (users[normalizedEmail] && users[normalizedEmail].password === password) {
        const standardUser = {
          id: `user-${normalizedEmail}`,
          email: normalizedEmail,
          user_metadata: {
            full_name: users[normalizedEmail].fullName,
            role: 'user',
            email_confirmed: Boolean(users[normalizedEmail].emailConfirmed),
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: users[normalizedEmail].createdAt || new Date().toISOString(),
        } as unknown as User;

        localStorage.setItem('abtalquest_mock_user', JSON.stringify(standardUser));
        return { user: standardUser, error: null };
      }
    }
  } catch {
    // Continue
  }

  // Try Supabase Auth
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!error && data.user) {
        if (isSuperAdminTarget) {
          localStorage.setItem('abtalquest_active_admin', JSON.stringify(data.user));
        }
        return { user: data.user, error: null };
      }

      // If Super Admin logs in with default master pass
      if (
        isSuperAdminTarget &&
        (password === SUPER_ADMIN_DEFAULT_PASS ||
          password === 'AbtalAdmin2026!' ||
          password === 'ElMahdi@Abtal2026!')
      ) {
        const superAdminUser = {
          id: '39f9b51f-63c8-4448-bc2c-e6898163616c',
          email: SUPER_ADMIN_EMAIL,
          user_metadata: {
            full_name: SUPER_ADMIN_NAME,
            role: 'super_admin',
            is_super_admin: true,
          },
          app_metadata: { provider: 'email' },
          aud: 'authenticated',
          created_at: '2026-09-18T16:42:42.467Z',
        } as unknown as User;

        localStorage.setItem('abtalquest_active_admin', JSON.stringify(superAdminUser));
        return { user: superAdminUser, error: null };
      }

      if (error) {
        return { user: null, error: error.message };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return { user: null, error: message };
    }
  }

  // Offline / Mock fallback mode
  if (
    isSuperAdminTarget &&
    (password === SUPER_ADMIN_DEFAULT_PASS ||
      password === 'AbtalAdmin2026!' ||
      password === 'ElMahdi@Abtal2026!')
  ) {
    const superAdminUser = {
      id: '39f9b51f-63c8-4448-bc2c-e6898163616c',
      email: SUPER_ADMIN_EMAIL,
      user_metadata: {
        full_name: SUPER_ADMIN_NAME,
        role: 'super_admin',
        is_super_admin: true,
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    localStorage.setItem('abtalquest_active_admin', JSON.stringify(superAdminUser));
    return { user: superAdminUser, error: null };
  }

  return { user: null, error: 'Invalid email or password.' };
};

/**
 * Sign up a new customer / family user with email, password, and full name
 * Immediately triggers an Account Confirmation & Welcome email with a 6-digit code!
 */
export const signUpUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<{ user: User | null; error: string | null; confirmationRequired: boolean; verificationCode?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Immediately trigger the Welcome & Verification Code email
  const emailRes = await sendWelcomeAndConfirmationEmail(normalizedEmail, fullName);

  // 2. Persist in local user registry
  try {
    const usersRaw = localStorage.getItem('abtalquest_registered_users') || '{}';
    const users = JSON.parse(usersRaw);
    users[normalizedEmail] = {
      email: normalizedEmail,
      fullName,
      password,
      emailConfirmed: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('abtalquest_registered_users', JSON.stringify(users));
  } catch (err) {
    console.warn('Failed to cache user credentials:', err);
  }

  if (!isSupabaseConfigured()) {
    const mockUser = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      user_metadata: { full_name: fullName, role: 'user' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    return {
      user: mockUser,
      error: null,
      confirmationRequired: true,
      verificationCode: emailRes.code,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message, confirmationRequired: false };
    }

    return {
      user: data.user,
      error: null,
      confirmationRequired: true,
      verificationCode: emailRes.code,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return { user: null, error: message, confirmationRequired: false };
  }
};

/**
 * Confirm a newly created user account via email verification code
 */
export const confirmUserEmail = async (
  email: string,
  code: string
): Promise<{ success: boolean; error: string | null }> => {
  const res = verifyEmailCode(email, code, 'confirm_email');
  if (!res.success) {
    return res;
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const usersRaw = localStorage.getItem('abtalquest_registered_users') || '{}';
    const users = JSON.parse(usersRaw);
    if (users[normalizedEmail]) {
      users[normalizedEmail].emailConfirmed = true;
      localStorage.setItem('abtalquest_registered_users', JSON.stringify(users));
    }
  } catch {
    // Ignore
  }

  return { success: true, error: null };
};

/**
 * Request Password Reset: triggers 6-digit OTP verification email for users or admins
 */
export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; error: string | null; code?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const isSuperAdminTarget = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Send 6-digit reset code email
  const res = await sendPasswordResetCodeEmail(normalizedEmail, isSuperAdminTarget);
  if (!res.success) {
    return { success: false, error: res.error || 'Failed to dispatch password reset email.' };
  }

  return { success: true, error: null, code: res.code };
};

/**
 * Verify Password Reset 6-Digit Code
 */
export const verifyPasswordResetCode = async (
  email: string,
  code: string
): Promise<{ success: boolean; error: string | null }> => {
  return verifyEmailCode(email, code, 'reset_password');
};

/**
 * Complete Password Reset with Verified Code and New Password
 */
export const completePasswordReset = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const isSuperAdminTarget = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Update in admin credentials registry (if admin/manager/super admin)
  try {
    const credsRaw = localStorage.getItem('abtalquest_admin_credentials') || '{}';
    const creds = JSON.parse(credsRaw);
    if (isSuperAdminTarget) {
      creds[normalizedEmail] = {
        password: newPassword,
        role: 'super_admin',
        fullName: SUPER_ADMIN_NAME,
      };
      localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
    } else if (creds[normalizedEmail]) {
      creds[normalizedEmail].password = newPassword;
      localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
    }
  } catch {
    // Ignore
  }

  // Update in registered users registry (for regular users)
  try {
    const usersRaw = localStorage.getItem('abtalquest_registered_users') || '{}';
    const users = JSON.parse(usersRaw);
    if (users[normalizedEmail]) {
      users[normalizedEmail].password = newPassword;
      localStorage.setItem('abtalquest_registered_users', JSON.stringify(users));
    }
  } catch {
    // Ignore
  }

  // Update in Supabase Auth if session exists or configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.updateUser({ password: newPassword });
    } catch {
      // Offline fallback succeeded
    }
  }

  return { success: true, error: null };
};

/**
 * Check if the given user has verified administrator privileges (Super Admin, Admin, Manager, Support Admin)
 */
export const verifyIsAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email) return false;
  const email = user.email.trim().toLowerCase();

  // 1. Super Admin is strictly and unconditionally authorized
  if (isSuperAdmin(user)) {
    return true;
  }

  // 2. Check user metadata for manager or admin role
  const role = user.user_metadata?.role;
  if (role && ['admin', 'manager', 'content_manager', 'marketplace_manager', 'support_admin', 'support', 'super_admin'].includes(role)) {
    return true;
  }

  // 3. Check Supabase admin_users table
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      if (!error && data?.role && ['admin', 'manager', 'content_manager', 'marketplace_manager', 'support_admin', 'support', 'super_admin'].includes(data.role)) {
        return true;
      }
    } catch {
      // Fallback
    }
  }

  // 4. Check local admin directory
  try {
    const raw = localStorage.getItem('abtalquest_admin_directory');
    if (raw) {
      const list: AdminUserRecord[] = JSON.parse(raw);
      if (list.some((a) => a.email.toLowerCase() === email)) {
        return true;
      }
    }
  } catch {
    // Ignore
  }

  // 5. Authorized domain
  if (email.endsWith('@abtalquest.com')) {
    return true;
  }

  return false;
};

/**
 * Get all registered administrator accounts
 * Super Admin (ElMahdi Ak) is always returned at index 0 as protected owner
 */
export const getAdminUsersList = async (): Promise<AdminUserRecord[]> => {
  const masterSuperAdmin: AdminUserRecord = {
    id: '39f9b51f-63c8-4448-bc2c-e6898163616c',
    email: SUPER_ADMIN_EMAIL,
    fullName: SUPER_ADMIN_NAME,
    role: 'super_admin',
    isSuperAdmin: true,
    createdBy: 'System Master Initializer',
    createdAt: '2026-09-18T16:42:42Z',
    permissions: ROLE_DEFAULT_PERMISSIONS.super_admin,
  };

  let list: AdminUserRecord[] = [masterSuperAdmin];

  // Fetch remote from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const remoteAdmins: AdminUserRecord[] = data.map((row) => {
          const role = (row.role || 'admin') as AdminRole;
          const perms = Array.isArray(row.permissions) && row.permissions.length > 0
            ? (row.permissions as AdminTabPermission[])
            : ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.admin;

          return {
            id: row.id,
            email: row.email,
            fullName: row.full_name || row.email.split('@')[0],
            role,
            isSuperAdmin: row.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase(),
            createdBy: row.created_by || 'ElMahdi Ak',
            createdAt: row.created_at || new Date().toISOString(),
            updatedAt: row.updated_at,
            permissions: perms,
          };
        });

        const others = remoteAdmins.filter(
          (a) => a.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()
        );
        list = [masterSuperAdmin, ...others];
      }
    } catch {
      // Remote table awaiting migration, fallback to local directory
    }
  }

  // Merge with local directory
  try {
    const raw = localStorage.getItem('abtalquest_admin_directory');
    if (raw) {
      const localAdmins: AdminUserRecord[] = JSON.parse(raw);
      for (const la of localAdmins) {
        if (!list.some((existing) => existing.email.toLowerCase() === la.email.toLowerCase())) {
          const role = (la.role || 'admin') as AdminRole;
          const perms = Array.isArray(la.permissions) && la.permissions.length > 0
            ? la.permissions
            : ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.admin;

          list.push({
            ...la,
            isSuperAdmin: la.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase(),
            permissions: perms,
          });
        }
      }
    }
  } catch {
    // Ignore
  }

  return list;
};

/**
 * Provision a new Administrator or Manager account
 * STRICT SECURITY: ONLY executable if the calling user is strictly the Super Administrator (ElMahdi Ak: akmahdi085@gmail.com)
 * Dispatches an email notification immediately to the new manager or admin!
 */
export const createAdminAccountBySuperAdmin = async (
  params: {
    email: string;
    password: string;
    fullName: string;
    role: AdminRole;
    permissions?: AdminTabPermission[];
  },
  currentSuperAdminUser: User | null
): Promise<{ success: boolean; error: string | null }> => {
  // Strict Super Admin Permission Guard
  if (!isSuperAdmin(currentSuperAdminUser)) {
    return {
      success: false,
      error: 'Permission Denied: Only the Primary Super Administrator (ElMahdi Ak - akmahdi085@gmail.com) has authority to provision manager or administrator accounts.',
    };
  }

  const email = params.email.trim().toLowerCase();
  if (!email || !params.password || params.password.length < 6) {
    return {
      success: false,
      error: 'Please provide a valid email address and a password with at least 6 characters.',
    };
  }

  const role = params.role;
  const defaultPerms = ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.admin;
  const permissions = params.permissions && params.permissions.length > 0 ? params.permissions : defaultPerms;
  const isSuper = role === 'super_admin';

  try {
    // 1. Sign up user in Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signUp({
          email,
          password: params.password,
          options: {
            data: {
              full_name: params.fullName,
              role,
              permissions,
              is_super_admin: isSuper,
              created_by: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
            },
          },
        });
      } catch (err) {
        console.warn('Supabase Auth provisioning warning:', err);
      }

      // 2. Insert into admin_users directory table
      try {
        const { error: insertErr } = await supabase.from('admin_users').insert({
          email,
          full_name: params.fullName,
          role,
          permissions,
          is_super_admin: isSuper,
          created_by: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
        });

        if (insertErr) {
          // Fallback if permissions column is missing in remote DB
          await supabase.from('admin_users').insert({
            email,
            full_name: params.fullName,
            role,
            is_super_admin: isSuper,
            created_by: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
          });
        }
      } catch (err) {
        console.warn('Supabase admin_users insert warning:', err);
      }
    }

    // 3. Save to local admin directory cache
    const newRecord: AdminUserRecord = {
      id: `admin-${Date.now()}`,
      email,
      fullName: params.fullName,
      role,
      isSuperAdmin: isSuper,
      createdBy: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
      permissions,
    };

    const raw = localStorage.getItem('abtalquest_admin_directory');
    const existing: AdminUserRecord[] = raw ? JSON.parse(raw) : [];
    if (!existing.some((a) => a.email.toLowerCase() === email)) {
      existing.push(newRecord);
      localStorage.setItem('abtalquest_admin_directory', JSON.stringify(existing));
    }

    // Store appointed credentials for immediate login
    try {
      const credsRaw = localStorage.getItem('abtalquest_admin_credentials') || '{}';
      const creds = JSON.parse(credsRaw);
      creds[email] = {
        password: params.password,
        role,
        fullName: params.fullName,
        permissions,
      };
      localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
    } catch {
      // Ignore
    }

    // 4. Immediately trigger Manager / Admin Appointment Invitation Email!
    await sendAdminInvitationEmail({
      email,
      fullName: params.fullName,
      role,
      temporaryPass: params.password,
      appointedBy: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
    });

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to provision account.',
    };
  }
};

/**
 * Update Administrator Role & Permissions
 * STRICT SECURITY: ONLY executable if caller is strictly the Super Administrator (ElMahdi Ak: akmahdi085@gmail.com)
 */
export const updateAdminUserRoleAndPermissions = async (
  params: {
    email: string;
    fullName?: string;
    role: AdminRole;
    permissions: AdminTabPermission[];
  },
  currentSuperAdminUser: User | null
): Promise<{ success: boolean; error: string | null; updatedRecord?: AdminUserRecord }> => {
  if (!isSuperAdmin(currentSuperAdminUser)) {
    return {
      success: false,
      error: 'Permission Denied: Only the Primary Super Administrator (ElMahdi Ak) can modify administrator access and roles.',
    };
  }

  const normalized = params.email.trim().toLowerCase();
  const isMasterOwner = normalized === SUPER_ADMIN_EMAIL.toLowerCase();

  // Protect master owner from demotion
  if (isMasterOwner && params.role !== 'super_admin') {
    return {
      success: false,
      error: 'Protected Master Account: The Primary Super Administrator (akmahdi085@gmail.com) role cannot be modified or demoted.',
    };
  }

  const role: AdminRole = isMasterOwner ? 'super_admin' : params.role;
  const permissions: AdminTabPermission[] = isMasterOwner
    ? ROLE_DEFAULT_PERMISSIONS.super_admin
    : (params.permissions && params.permissions.length > 0
        ? params.permissions
        : (ROLE_DEFAULT_PERMISSIONS[role] || ['orders']));

  const isSuper = role === 'super_admin';
  const now = new Date().toISOString();

  // 1. Update in Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({
          role,
          full_name: params.fullName,
          permissions,
          is_super_admin: isSuper,
          updated_at: now,
        })
        .eq('email', normalized);

      if (updateErr) {
        console.warn('Supabase full update warning, retrying basic fields:', updateErr.message);
        await supabase
          .from('admin_users')
          .update({
            role,
            full_name: params.fullName,
            is_super_admin: isSuper,
          })
          .eq('email', normalized);
      }
    } catch (err) {
      console.warn('Error updating remote admin_users:', err);
    }
  }

  // 2. Update local directory cache
  let updatedRecord: AdminUserRecord | undefined;
  try {
    const raw = localStorage.getItem('abtalquest_admin_directory');
    const list: AdminUserRecord[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((a) => a.email.toLowerCase() === normalized);

    if (index >= 0) {
      list[index] = {
        ...list[index],
        role,
        fullName: params.fullName || list[index].fullName,
        isSuperAdmin: isSuper,
        permissions,
        updatedAt: now,
      };
      updatedRecord = list[index];
    } else {
      updatedRecord = {
        id: `admin-${Date.now()}`,
        email: normalized,
        fullName: params.fullName || normalized.split('@')[0],
        role,
        isSuperAdmin: isSuper,
        createdBy: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
        createdAt: now,
        updatedAt: now,
        permissions,
      };
      list.push(updatedRecord);
    }
    localStorage.setItem('abtalquest_admin_directory', JSON.stringify(list));

    // Update stored credentials role & permissions
    const credsRaw = localStorage.getItem('abtalquest_admin_credentials') || '{}';
    const creds = JSON.parse(credsRaw);
    if (creds[normalized]) {
      creds[normalized].role = role;
      creds[normalized].permissions = permissions;
      if (params.fullName) creds[normalized].fullName = params.fullName;
      localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
    }

    // If currently active admin in session matches edited user, update active session
    const activeAdminRaw = localStorage.getItem('abtalquest_active_admin');
    if (activeAdminRaw) {
      const activeAdmin = JSON.parse(activeAdminRaw);
      if (activeAdmin.email?.toLowerCase() === normalized) {
        activeAdmin.user_metadata = {
          ...activeAdmin.user_metadata,
          role,
          permissions,
          is_super_admin: isSuper,
          full_name: params.fullName || activeAdmin.user_metadata?.full_name,
        };
        localStorage.setItem('abtalquest_active_admin', JSON.stringify(activeAdmin));
      }
    }
  } catch (err) {
    console.warn('Failed to update local storage admin:', err);
  }

  return { success: true, error: null, updatedRecord };
};

/**
 * Check whether a user has permission to view/interact with a specific admin tab
 */
export const hasAdminTabPermission = (
  user: User | null,
  tab: AdminTabPermission,
  customPermissions?: AdminTabPermission[]
): boolean => {
  if (!user || !user.email) return false;

  // Primary Super Administrator always has full permission to everything
  if (isSuperAdmin(user)) return true;

  // Team tab is strictly Super Admin exclusive
  if (tab === 'team') {
    const role = (user.user_metadata?.role || '') as AdminRole;
    return role === 'super_admin';
  }

  // If explicit customPermissions provided
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(tab);
  }

  // Check user_metadata.permissions
  const metaPerms = user.user_metadata?.permissions;
  if (Array.isArray(metaPerms) && metaPerms.length > 0) {
    return metaPerms.includes(tab);
  }

  // Fall back to role default permissions
  const role = (user.user_metadata?.role || 'admin') as AdminRole;
  const defaults = ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.admin;
  return defaults.includes(tab);
};

/**
 * Revoke an Administrator or Manager account
 * STRICT SECURITY: ONLY executable if calling user is strictly the Super Administrator (ElMahdi Ak: akmahdi085@gmail.com)
 */
export const removeAdminAccountBySuperAdmin = async (
  adminEmail: string,
  currentSuperAdminUser: User | null
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSuperAdmin(currentSuperAdminUser)) {
    return {
      success: false,
      error: 'Permission Denied: Only the Primary Super Administrator (ElMahdi Ak) can revoke administrator or manager accounts.',
    };
  }

  const normalized = adminEmail.trim().toLowerCase();
  if (normalized === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'Protected Master Account: The Primary Super Administrator (akmahdi085@gmail.com) cannot be revoked.',
    };
  }

  // Delete from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('admin_users').delete().eq('email', normalized);
    } catch (err) {
      console.warn('Error deleting from remote admin_users:', err);
    }
  }

  // Remove from local cache
  try {
    const raw = localStorage.getItem('abtalquest_admin_directory');
    if (raw) {
      const list: AdminUserRecord[] = JSON.parse(raw);
      const filtered = list.filter((a) => a.email.toLowerCase() !== normalized);
      localStorage.setItem('abtalquest_admin_directory', JSON.stringify(filtered));
    }

    const credsRaw = localStorage.getItem('abtalquest_admin_credentials') || '{}';
    const creds = JSON.parse(credsRaw);
    delete creds[normalized];
    localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
  } catch {
    // Ignore
  }

  return { success: true, error: null };
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  localStorage.removeItem('abtalquest_mock_user');
  localStorage.removeItem('abtalquest_active_admin');
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const activeAdmin = localStorage.getItem('abtalquest_active_admin');
  if (activeAdmin) {
    try {
      return JSON.parse(activeAdmin);
    } catch {
      // Ignore
    }
  }

  if (!isSupabaseConfigured()) {
    const mock = localStorage.getItem('abtalquest_mock_user');
    return mock ? JSON.parse(mock) : null;
  }

  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
};

/**
 * Subscribe to Auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null, session: Session | null) => void
) => {
  const activeAdmin = localStorage.getItem('abtalquest_active_admin');
  if (activeAdmin) {
    try {
      const adminUser = JSON.parse(activeAdmin);
      callback(adminUser, null);
    } catch {
      // Ignore
    }
  }

  if (!isSupabaseConfigured()) {
    const mock = localStorage.getItem('abtalquest_mock_user');
    callback(mock ? JSON.parse(mock) : null, null);
    return { unsubscribe: () => {} };
  }

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    const currentActiveAdmin = localStorage.getItem('abtalquest_active_admin');
    if (currentActiveAdmin) {
      try {
        callback(JSON.parse(currentActiveAdmin), session);
        return;
      } catch {
        // Fall through
      }
    }
    callback(session?.user ?? null, session);
  });

  return {
    unsubscribe: () => {
      authListener?.subscription.unsubscribe();
    },
  };
};
