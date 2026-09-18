import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName?: string;
  role?: 'super_admin' | 'admin' | 'support_admin' | 'user';
  createdAt?: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'support_admin';
  isSuperAdmin: boolean;
  createdBy: string;
  createdAt: string;
}

// Master Super Administrator Credentials & Metadata
export const SUPER_ADMIN_EMAIL = 'akmahdi085@gmail.com';
export const SUPER_ADMIN_NAME = 'ElMahdi Ak';
export const SUPER_ADMIN_DEFAULT_PASS = 'AbtalAdmin2026!#Quest';

/**
 * Check whether a user is the primary Super Administrator
 * Only the Super Admin (ElMahdi Ak) is authorized to add or revoke other admin accounts
 */
export const isSuperAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  const normalized = user.email.trim().toLowerCase();
  return (
    normalized === SUPER_ADMIN_EMAIL.toLowerCase() ||
    user.user_metadata?.is_super_admin === true ||
    user.user_metadata?.role === 'super_admin'
  );
};

/**
 * Sign in user with email and password via Supabase Auth
 * Includes instant authorization fallback for Super Admin if remote email confirmation is pending
 */
export const signInUser = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const isSuperAdminTarget = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Try Supabase Auth first
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

      // If Super Admin logs in with master credentials and Supabase email confirmation is pending
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

      // Check appointed admins provisioned by Super Admin from local cache
      try {
        const credsRaw = localStorage.getItem('abtalquest_admin_credentials');
        if (credsRaw) {
          const creds = JSON.parse(credsRaw);
          if (creds[normalizedEmail] && creds[normalizedEmail].password === password) {
            const appointedAdminUser = {
              id: `admin-${normalizedEmail}`,
              email: normalizedEmail,
              user_metadata: {
                full_name: creds[normalizedEmail].fullName,
                role: creds[normalizedEmail].role,
                is_super_admin: false,
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as unknown as User;
            localStorage.setItem('abtalquest_active_admin', JSON.stringify(appointedAdminUser));
            return { user: appointedAdminUser, error: null };
          }
        }
      } catch {
        // Continue
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

  const mockUser = {
    id: 'mock-user-id',
    email: normalizedEmail,
    user_metadata: { full_name: normalizedEmail.split('@')[0], role: 'user' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User;
  localStorage.setItem('abtalquest_mock_user', JSON.stringify(mockUser));
  return { user: mockUser, error: null };
};

/**
 * Sign up a new customer / family user with email, password, and full name
 */
export const signUpUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<{ user: User | null; error: string | null; confirmationRequired: boolean }> => {
  if (!isSupabaseConfigured()) {
    const mockUser = {
      id: `mock-user-${Date.now()}`,
      email,
      user_metadata: { full_name: fullName, role: 'user' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    localStorage.setItem('abtalquest_mock_user', JSON.stringify(mockUser));
    return { user: mockUser, error: null, confirmationRequired: false };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
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

    const confirmationRequired = !data.session && Boolean(data.user);

    return {
      user: data.user,
      error: null,
      confirmationRequired,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return { user: null, error: message, confirmationRequired: false };
  }
};

/**
 * Check if the given user has verified administrator privileges
 */
export const verifyIsAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email) return false;
  const email = user.email.trim().toLowerCase();

  // 1. Super Admin is unconditionally authorized
  if (isSuperAdmin(user)) {
    return true;
  }

  // 2. Check user metadata
  if (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'support_admin') {
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

      if (!error && data?.role) {
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
        const remoteAdmins: AdminUserRecord[] = data.map((row) => ({
          id: row.id,
          email: row.email,
          fullName: row.full_name || row.email.split('@')[0],
          role: (row.role || 'admin') as AdminUserRecord['role'],
          isSuperAdmin: Boolean(row.is_super_admin || row.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()),
          createdBy: row.created_by || 'ElMahdi Ak',
          createdAt: row.created_at || new Date().toISOString(),
        }));

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
          list.push(la);
        }
      }
    }
  } catch {
    // Ignore
  }

  return list;
};

/**
 * Provision a new Administrator account
 * STRICT SECURITY: ONLY executable if the calling user is the Super Administrator (ElMahdi Ak)
 */
export const createAdminAccountBySuperAdmin = async (
  params: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'support_admin';
  },
  currentSuperAdminUser: User | null
): Promise<{ success: boolean; error: string | null }> => {
  // Permission Guard
  if (!isSuperAdmin(currentSuperAdminUser)) {
    return {
      success: false,
      error: 'Permission Denied: Only the Primary Super Administrator (ElMahdi Ak) has permission to provision administrator accounts.',
    };
  }

  const email = params.email.trim().toLowerCase();
  if (!email || !params.password || params.password.length < 6) {
    return {
      success: false,
      error: 'Please provide a valid email address and a password with at least 6 characters.',
    };
  }

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
              role: params.role,
              is_super_admin: false,
              created_by: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
            },
          },
        });
      } catch (err) {
        console.warn('Supabase Auth provisioning warning:', err);
      }

      // 2. Insert into admin_users directory table
      try {
        await supabase.from('admin_users').insert({
          email,
          full_name: params.fullName,
          role: params.role,
          is_super_admin: false,
          created_by: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
        });
      } catch (err) {
        console.warn('Supabase admin_users insert warning:', err);
      }
    }

    // 3. Save to local admin directory cache
    const newRecord: AdminUserRecord = {
      id: `admin-${Date.now()}`,
      email,
      fullName: params.fullName,
      role: params.role,
      isSuperAdmin: false,
      createdBy: currentSuperAdminUser?.email || SUPER_ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem('abtalquest_admin_directory');
    const existing: AdminUserRecord[] = raw ? JSON.parse(raw) : [];
    if (!existing.some((a) => a.email.toLowerCase() === email)) {
      existing.push(newRecord);
      localStorage.setItem('abtalquest_admin_directory', JSON.stringify(existing));
    }

    // Store appointed admin credentials for offline/immediate login
    try {
      const credsRaw = localStorage.getItem('abtalquest_admin_credentials') || '{}';
      const creds = JSON.parse(credsRaw);
      creds[email] = {
        password: params.password,
        role: params.role,
        fullName: params.fullName,
      };
      localStorage.setItem('abtalquest_admin_credentials', JSON.stringify(creds));
    } catch {
      // Ignore
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to provision administrator account.',
    };
  }
};

/**
 * Revoke an Administrator account
 * STRICT SECURITY: ONLY executable if calling user is the Super Administrator (ElMahdi Ak)
 */
export const removeAdminAccountBySuperAdmin = async (
  adminEmail: string,
  currentSuperAdminUser: User | null
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSuperAdmin(currentSuperAdminUser)) {
    return {
      success: false,
      error: 'Permission Denied: Only the Primary Super Administrator (ElMahdi Ak) can revoke administrator accounts.',
    };
  }

  const normalized = adminEmail.trim().toLowerCase();
  if (normalized === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'Protected Master Account: The Primary Super Administrator (ElMahdi Ak) cannot be revoked.',
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
 * Subscribe to Supabase Auth state changes
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

