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
    
    // FIXED ADMIN ACCOUNT CHECK
    const FIXED_ADMIN = {
      email: 'admin@loanlink.com',
      password: 'admin123',
      data: {
        id: 'admin-fixed-id',
        name: 'System Administrator',
        email: 'admin@loanlink.com',
        role: 'admin'
      }
    };

    try {
      // 1. Check for Fixed Admin
      if (email === FIXED_ADMIN.email && password === FIXED_ADMIN.password) {
        const response = await authAPI.login({ email, password });
        if (response.success) {
          const backendData = response.data.user;
          const fakeFirebaseUser = {
            uid: backendData.id,
            email: backendData.email,
            displayName: backendData.name,
            emailVerified: true
          };
          setUser(fakeFirebaseUser);
          setBackendUser(backendData);
          localStorage.setItem('fakeUser', JSON.stringify(fakeFirebaseUser));
          setLoading(false);
          return { user: fakeFirebaseUser };
        }
      }

      // 2. Regular Backend Login (for Managers and Borrowers)
      const response = await authAPI.login({ email, password });
      if (response.success) {
        const backendData = response.data.user;
        const fakeFirebaseUser = {
          uid: backendData.id,
          email: backendData.email,
          displayName: backendData.name,
          emailVerified: true
        };
        setUser(fakeFirebaseUser);
        setBackendUser(backendData);
        localStorage.setItem('fakeUser', JSON.stringify(fakeFirebaseUser));
        setLoading(false);
        return { user: fakeFirebaseUser };
      }
    } catch (backendError) {
      console.warn('Backend login failed, trying Firebase fallback:', backendError.response?.data?.message || backendError.message);
      
      // 3. Fallback to Firebase Auth (for users who only have Firebase accounts)
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
      } catch (firebaseError) {
        setLoading(false);
        throw firebaseError;
      }
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
        // Check for fake test users (backdoor persistence)
        const storedUserJson = localStorage.getItem('fakeUser');
        if (storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          setUser(storedUser);
          
          // Re-identify which test account this was to set the correct backend role
          const testAccounts = {
              'superadmin@loanlink.com': { id: 'superadmin-123', name: 'Super Admin', role: 'admin' },
              'admin@loanlink.com': { id: 'admin-123', name: 'System Admin', role: 'admin' },
              'manager1@loanlink.com': { id: 'manager-123', name: 'Loan Manager 1', role: 'manager' },
              'manager2@loanlink.com': { id: 'manager-456', name: 'Loan Manager 2', role: 'manager' },
              'manager@gamil.com': { id: 'manager-gamil', name: 'Loan Manager', role: 'manager' },
              'borrower1@loanlink.com': { id: 'borrower-123', name: 'John Borrower', role: 'borrower' },
              'borrower2@loanlink.com': { id: 'borrower-456', name: 'Jane Borrower', role: 'borrower' }
          };

          const acc = testAccounts[storedUser.email];
          if (acc) {
              setBackendUser({
                  id: acc.id,
                  name: acc.name,
                  email: storedUser.email,
                  role: acc.role
              });
          }
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
