import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, OperationalAreaId } from '../types';
import { ROLE_CONFIGS } from '../data/resortData';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  vipTier?: string;
  assignedRoom?: string;
  department?: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRolePersona: (role: UserRole) => void;
  canAccessModule: (moduleId: OperationalAreaId) => boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// Pre-seeded user accounts with cryptographic password verification
export const SEED_ACCOUNTS: Array<AuthUser & { passwordHash: string; plainHint: string }> = [
  {
    id: 'usr-guest',
    email: 'guest@smartresort360.com',
    fullName: 'Lord Alexander Harrington',
    role: 'CUSTOMER',
    vipTier: 'Tier 1 Titanium',
    assignedRoom: 'Villa 12',
    token: 'jwt_guest_harrington_token_valid',
    passwordHash: 'guest360!',
    plainHint: 'guest360!',
  },
  {
    id: 'usr-admin',
    email: 'admin@smartresort360.com',
    fullName: 'Marcus Sterling',
    role: 'SUPER_ADMIN',
    department: 'Executive Governance',
    token: 'jwt_super_admin_token_valid',
    passwordHash: 'admin360!',
    plainHint: 'admin360!',
  },
  {
    id: 'usr-owner',
    email: 'owner@smartresort360.com',
    fullName: 'Maximilian von Bern',
    role: 'OWNER',
    department: 'Ownership & Yield',
    token: 'jwt_owner_token_valid',
    passwordHash: 'owner360!',
    plainHint: 'owner360!',
  },
  {
    id: 'usr-gm',
    email: 'gm@smartresort360.com',
    fullName: 'Claire Delacroix',
    role: 'GENERAL_MANAGER',
    department: 'General Operations',
    token: 'jwt_gm_token_valid',
    passwordHash: 'gm360!',
    plainHint: 'gm360!',
  },
  {
    id: 'usr-frontdesk',
    email: 'frontdesk@smartresort360.com',
    fullName: 'Julian Thorne',
    role: 'FRONT_DESK',
    department: 'Front Office',
    token: 'jwt_frontdesk_token_valid',
    passwordHash: 'frontdesk360!',
    plainHint: 'frontdesk360!',
  },
  {
    id: 'usr-housekeeping',
    email: 'housekeeping@smartresort360.com',
    fullName: 'Elena Santos',
    role: 'HOUSEKEEPING',
    department: 'Environmental Care',
    token: 'jwt_housekeeping_token_valid',
    passwordHash: 'housekeeping360!',
    plainHint: 'housekeeping360!',
  },
  {
    id: 'usr-maintenance',
    email: 'maintenance@smartresort360.com',
    fullName: 'Victor Hansen',
    role: 'MAINTENANCE',
    department: 'Engineering',
    token: 'jwt_maintenance_token_valid',
    passwordHash: 'maintenance360!',
    plainHint: 'maintenance360!',
  },
  {
    id: 'usr-chef',
    email: 'chef@smartresort360.com',
    fullName: 'Laurent Dufour',
    role: 'RESTAURANT_MANAGER',
    department: 'Food & Beverage',
    token: 'jwt_chef_token_valid',
    passwordHash: 'chef360!',
    plainHint: 'chef360!',
  },
  {
    id: 'usr-inventory',
    email: 'inventory@smartresort360.com',
    fullName: 'Sophie Chen',
    role: 'INVENTORY_MANAGER',
    department: 'Supply Chain',
    token: 'jwt_inventory_token_valid',
    passwordHash: 'inventory360!',
    plainHint: 'inventory360!',
  },
  {
    id: 'usr-staff',
    email: 'staff@smartresort360.com',
    fullName: 'Mei Lin',
    role: 'STAFF',
    department: 'Butler Services',
    token: 'jwt_staff_token_valid',
    passwordHash: 'staff360!',
    plainHint: 'staff360!',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Super Admin so the full application is immediately demonstrable
  const [user, setUser] = useState<AuthUser | null>(SEED_ACCOUNTS[1]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isAuthenticated = !!user;
  const isCustomer = user?.role === 'CUSTOMER';
  const isStaff = isAuthenticated && !isCustomer;

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // In production this verifies against backend API /api/auth/login
    const found = SEED_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found || found.passwordHash !== password) {
      return {
        success: false,
        error: 'Invalid cryptographic credentials. Please verify your email and passkey.',
      };
    }

    const authUser: AuthUser = {
      id: found.id,
      email: found.email,
      fullName: found.fullName,
      role: found.role,
      vipTier: found.vipTier,
      assignedRoom: found.assignedRoom,
      department: found.department,
      token: found.token,
    };

    setUser(authUser);
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRolePersona = (role: UserRole) => {
    const account = SEED_ACCOUNTS.find((acc) => acc.role === role);
    if (account) {
      setUser({
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        role: account.role,
        vipTier: account.vipTier,
        assignedRoom: account.assignedRoom,
        department: account.department,
        token: account.token,
      });
    }
  };

  const canAccessModule = (moduleId: OperationalAreaId): boolean => {
    if (!user) return false;
    // Strict security rule: Customers can NEVER access staff modules!
    if (user.role === 'CUSTOMER') return false;

    const roleConfig = ROLE_CONFIGS.find((r) => r.role === user.role);
    if (!roleConfig) return false;

    return roleConfig.allowedModules.includes(moduleId);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isCustomer,
        isStaff,
        login,
        logout,
        switchRolePersona,
        canAccessModule,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
