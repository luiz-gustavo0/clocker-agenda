import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFetch } from '@refetty/react';
import { addDays, subDays, format } from 'date-fns';
import axios from 'axios';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Container,
  Box,
  IconButton,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';

import { formatDate, Logo, TimeBlock } from '../components';

const getSchedule = async ({ when, username }) =>
  axios({
    method: 'get',
    url: '/api/schedule',
    params: {
      username,
      date: format(when, 'yyyy-MM-dd'),
    },
  });

const Header = ({ children }) => (
  <Box display='flex' alignItems='center' justifyContent='space-between' py='4'>
    {children}
  </Box>
);

export default function Schedule() {
  const router = useRouter();

  const [when, setWhen] = useState(() => new Date());
  const [data, { loading }, fetch] = useFetch(getSchedule, {
    lazy: true,
  });

  const addDay = () => setWhen((prevState) => addDays(prevState, 1));
  const removeDay = () => setWhen((prevState) => subDays(prevState, 1));

  const refresh = () => fetch({ when, username: router.query.username });

  useEffect(() => {
    refresh();
  }, [when, router.query.username]);

  return (
    <Container>
      <Header>
        <Logo size={150} />
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
        {data?.map(({ time, isBlocked }) => (
          <TimeBlock
            key={time}
            time={time}
            date={when}
            disabled={isBlocked}
            onSuccess={refresh}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
