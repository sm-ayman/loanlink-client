import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import { authAPI } from "../utils/api";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendUser, setBackendUser] = useState(null);

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // Helper function to sync Firebase user with backend
  const syncWithBackend = async (firebaseUser, role = 'borrower') => {
    try {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoURL: firebaseUser.photoURL || '',
        role: role
      };

      // Try to register/login with backend
      const response = await authAPI.registerFromFirebase(userData);

      if (response.success) {
        setBackendUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Backend sync error:', error);
      // Continue with Firebase user even if backend sync fails
    }
    return null;
  };

  // Helper function to login with backend
  const loginWithBackend = async (firebaseUser) => {
    try {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email
      };

      const response = await authAPI.loginFromFirebase(userData);

      if (response.success) {
        setBackendUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Backend login error:', error);
      // Continue with Firebase user even if backend login fails
    }
    return null;
  };

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Firebase user created, but we'll sync with backend on auth state change
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    // BACKDOOR FOR TEST ACCOUNTS (Bypass Firebase)
    const testAccounts = {
        'superadmin@loanlink.com': { uid: 'superadmin-123', name: 'Super Admin', role: 'admin' },
        'admin@loanlink.com': { uid: 'admin-123', name: 'System Admin', role: 'admin' },
        'manager1@loanlink.com': { uid: 'manager-123', name: 'Loan Manager 1', role: 'manager' },
        'manager2@loanlink.com': { uid: 'manager-456', name: 'Loan Manager 2', role: 'manager' },
        'borrower1@loanlink.com': { uid: 'borrower-123', name: 'John Borrower', role: 'borrower' },
        'borrower2@loanlink.com': { uid: 'borrower-456', name: 'Jane Borrower', role: 'borrower' }
    };

    if (testAccounts[email] && password === (email.includes('admin') ? 'admin123' : email.includes('manager') ? 'manager123' : 'borrower123')) {
        return new Promise((resolve) => {
            const acc = testAccounts[email];
            const fakeUser = {
                uid: acc.uid,
                email: email,
                displayName: acc.name,
                emailVerified: true
            };
            setUser(fakeUser);
            setBackendUser({
                id: acc.uid,
                name: acc.name,
                email: email,
                role: acc.role
            });
            localStorage.setItem('fakeUser', JSON.stringify(fakeUser));
            setLoading(false);
            resolve({ user: fakeUser });
        });
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Firebase login successful, but we'll sync with backend on auth state change
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const logOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('fakeUser');
      setUser(null);
      setBackendUser(null);
      await signOut(auth);
      // Also logout from backend
      await authAPI.logout().catch(() => {
        // Ignore backend logout errors
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Sync with backend
        try {
          const backendUserData = await loginWithBackend(currentUser);
          if (backendUserData) {
            console.log('Backend user synced:', backendUserData);
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      } else {
        // Check for fake super admin
        const storedUser = localStorage.getItem('fakeUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setBackendUser({
            id: 'superadmin-123',
            name: 'Super Admin',
            email: 'superadmin@loanlink.com',
            role: 'admin'
          });
        } else {
          setUser(null);
          setBackendUser(null);
        }
      }

      console.log('CurrentUser-->', currentUser);
      setLoading(false);
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    backendUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    logOut,
    updateUserProfile,
    // Utility to get the effective user (backend user takes precedence)
    getEffectiveUser: () => backendUser || {
      id: user?.uid,
      name: user?.displayName || user?.email?.split('@')[0],
      email: user?.email,
      role: 'borrower', // Default role for Firebase-only users
      photoURL: user?.photoURL
    },
    // Check if user is authenticated (has backend session)
    isAuthenticated: () => !!backendUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
