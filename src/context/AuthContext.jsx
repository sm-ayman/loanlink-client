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

  const signUp = async (name, email, password, role, photoURL) => {
    setLoading(true);
    try {
      // 1. Create Firebase User
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update Firebase Profile
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || ''
      });

      // 3. Sync with Backend
      const userData = {
        uid: result.user.uid,
        email: email,
        name: name,
        photoURL: photoURL || '',
        role: role || 'borrower'
      };

      const response = await authAPI.registerFromFirebase(userData);
      
      if (response.success) {
        setBackendUser(response.data.user);
        localStorage.setItem('fakeUser', JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: name,
          photoURL: photoURL || ''
        }));
        localStorage.setItem('backendUser', JSON.stringify(response.data.user));
      }

      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    
    const isFixedAdmin = email === 'admin@loanlink.com' || email === 'superadmin@loanlink.com';

    try {
      // 1. Regular Backend Login (for All Users)
      console.log('Attempting backend login for:', email);
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
        localStorage.setItem('backendUser', JSON.stringify(backendData));
        setLoading(false);
        return { user: fakeFirebaseUser };
      }
    } catch (backendError) {
      const errorMessage = backendError.response?.data?.message || backendError.message;
      console.warn('Backend login failed:', errorMessage);
      
      // 2. Fallback to Firebase Auth ONLY if not a fixed admin account
      if (!isFixedAdmin) {
        try {
          console.log('Trying Firebase fallback for non-admin user...');
          const result = await signInWithEmailAndPassword(auth, email, password);
          return result;
        } catch (firebaseError) {
          setLoading(false);
          throw firebaseError;
        }
      } else {
        // For admins, if backend fails, don't try Firebase (it will always fail there)
        setLoading(false);
        throw new Error(`Server Login Failed: ${errorMessage}`);
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
      localStorage.removeItem('backendUser');
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

        // Immediately restore backend user from storage to prevent flashing borrower role
        const storedBackendUser = localStorage.getItem('backendUser');
        if (storedBackendUser) {
          try {
            const parsed = JSON.parse(storedBackendUser);
            if (parsed.email === currentUser.email) {
                setBackendUser(parsed);
            }
          } catch (e) {
            console.error("Failed to parse stored backend user", e);
          }
        }

        // Sync with backend to get fresh data
        try {
          let backendUserData = await loginWithBackend(currentUser);
          
          // If user doesn't exist in backend yet, try to sync/register them
          if (!backendUserData) {
            console.log('User not found in backend, attempting to sync...');
            // Check if this is a known test manager account
            const isTestManager = currentUser.email === 'manager@gamil.com' || currentUser.email === 'manager@gmail.com';
            backendUserData = await syncWithBackend(currentUser, isTestManager ? 'manager' : 'borrower');
          }

          if (backendUserData) {
            console.log('Backend user synced:', backendUserData);
            setBackendUser(backendUserData);
            localStorage.setItem('backendUser', JSON.stringify(backendUserData));
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
              'manager@gmail.com': { id: 'manager-gmail', name: 'Loan Manager', role: 'manager' },
              'manager@gamil.com': { id: 'manager-gamil', name: 'Loan Manager (Gamil)', role: 'manager' },
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
          } else {
              // Try to restore from backendUser storage
              const storedBackendUser = localStorage.getItem('backendUser');
              if (storedBackendUser) {
                  setBackendUser(JSON.parse(storedBackendUser));
              }
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
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    logOut,
    updateUserProfile,
    // Utility to get the effective user (backend user takes precedence)
    getEffectiveUser: () => {
      if (backendUser) return backendUser;
      if (loading) return null; // Don't return a fake borrower role while loading
      
      return {
        id: user?.uid,
        name: user?.displayName || user?.email?.split('@')[0],
        email: user?.email,
        role: 'borrower', // Default role for Firebase-only users
        photoURL: user?.photoURL
      };
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
