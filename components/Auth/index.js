import * as React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { firebaseClient, persistenceMode } from '../../config/firebase/client';

const AuthContext = createContext([{}, () => {}]);

export const login = async ({ email, password }) => {
  firebaseClient.auth().setPersistence(persistenceMode);
  try {
    await firebaseClient.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.log('LOGIN ERROR:', error);
  }
};

export const logout = async () => {
  await firebaseClient.auth().signOut();
};

export const signup = async ({ email, password, username }) => {
  try {
    await firebaseClient.auth().createUserWithEmailAndPassword(email, password);

    await login({ email, password });
  } catch (err) {
    console.log('SIGNUP ERROR:', err);
  }
};

export const useAuth = () => {
  const [auth] = useContext(AuthContext);

  return [auth, { login, logout, signup }];
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    user: false,
  });

  useEffect(() => {
    const onsubscribe = firebaseClient.auth().onAuthStateChanged((user) => {
      setAuth({
        loading: false,
        user,
      });
    });

    return () => onsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
