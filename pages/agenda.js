import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFetch } from '@refetty/react';
import { addDays, subDays } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Container,
  Button,
  Box,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { formatDate, Logo, useAuth } from '../components';
import { getToken } from '../config/firebase/client';
import { format } from 'date-fns';

const getAgenda = async (when) => {
  const token = await getToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { date: format(when, 'yyyy-MM-dd') },
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

const AgendaBlock = ({ name, time, phone }) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      bg='gray.200'
      borderRadius='md'
      p='4'
      fontSize='xx-large'
      mb='4'
    >
      <Box flex='1'>{time}</Box>
      <Box textAlign='right'>
        <Text fontSize='xl'>{name}</Text>
        <Text fontSize='lg'>{phone}</Text>
      </Box>
    </Box>
  );
};

export default function Agenda() {
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(() => new Date());
  const [data, { loading }, fetch] = useFetch(getAgenda, {
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

      {loading && (
        <Spinner
          thickness='Apx'
          speed='0.65s'
          emptyColor='gray.200'
          size='xl'
        />
      )}
      {data?.map((doc) => (
        <AgendaBlock
          key={doc.time}
          time={doc.time}
          name={doc.name}
          phone={doc.phone}
        />
      ))}
    </Container>
  );
}
