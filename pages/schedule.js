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
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { formatDate, Logo, useAuth } from '../components';

const getSchedule = async (when) =>
  axios({
    method: 'get',
    url: '/api/schedule',
    params: { when, username: window.location.pathname },
  });

const Header = ({ children }) => (
  <Box display='flex' alignItems='center' justifyContent='space-between' py='4'>
    {children}
  </Box>
);

const TimeBlock = ({ time }) => {
  return (
    <Button p='8' bg='blue.500' color='#fff'>
      {time}
    </Button>
  );
};

export default function Schedule() {
  const router = useRouter();
  const [auth, { logout }] = useAuth();

  const [when, setWhen] = useState(() => new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, {
    lazy: true,
  });

  const addDay = () => setWhen((prevState) => addDays(prevState, 1));
  const removeDay = () => setWhen((prevState) => subDays(prevState, 1));

  // useEffect(() => {
  //   !auth.user && router.push('/');
  // }, [auth.user]);

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
      <SimpleGrid py='8' columns='2' spacing='4'>
        {loading && (
          <Spinner
            thickness='Apx'
            speed='0.65s'
            emptyColor='gray.200'
            size='xl'
          />
        )}
        {data?.map((time) => (
          <TimeBlock key={time} time={time} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
