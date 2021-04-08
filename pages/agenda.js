import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFetch } from '@refetty/react';
import { addDays, subDays } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Container, Button, Box, IconButton } from '@chakra-ui/react';
import { formatDate, Logo, useAuth } from '../components';
import { getToken } from '../config/firebase/client';

const getAgenda = async (when) => {
  const token = await getToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { when },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const Header = ({ children }) => (
  <Box display='flex' alignItems='center' justifyContent='space-between' py='4'>
    {children}
  </Box>
);

export default function Agenda() {
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(() => new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getAgenda, {
    lazy: true,
  });

  const addDay = () => setWhen((prevState) => addDays(prevState, 1));
  const removeDay = () => setWhen((prevState) => subDays(prevState, 1));

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user]);

  useEffect(() => {
    fetch(when);
  }, [when]);

  return (
    <Container>
      <Header>
        <Logo size={150} />
        <Button onClick={logout}>Sair</Button>
      </Header>

      <Box py='8' display='flex' alignItems='center' justifyContent='center'>
        <IconButton
          bg='transparent'
          icon={<ChevronLeftIcon />}
          onClick={removeDay}
        />
        <Box flex='1' textAlign='center'>
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton
          bg='transparent'
          icon={<ChevronRightIcon />}
          onClick={addDay}
        />
      </Box>
    </Container>
  );
}
