import { Container } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { useEffect, useState } from 'react';
import { Agenda, Login } from '../components';
import firebase from '../config/firebase';

export default function Home() {
  const [auth, setAuth] = useState({
    loading: true,
    user: false,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuth({
        loading: false,
        user,
      });
    });
  }, []);

  // const authenticatedUser = firebase.auth().currentUser;
  if (auth.loading) {
    return (
      <Container my='80' centerContent>
        <Spinner />
      </Container>
    );
  }
  return auth.user ? <Agenda /> : <Login />;
}
