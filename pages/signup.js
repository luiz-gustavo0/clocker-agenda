import * as yup from 'yup';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  FormHelperText,
} from '@chakra-ui/react';
import { Logo, useAuth } from '../components';
import Link from 'next/link';
import { useEffect } from 'react';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório'),
});

export default function Home() {
  const [auth, { signup }] = useAuth();
  const router = useRouter();

  const {
    values,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    isSubmitting,
  } = useFormik({
    onSubmit: signup,
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    auth.user && router.push('/agenda');
  }, [auth.user]);

  return (
    <Container p={8} border='1px solid red' maxWidth='5xl' centerContent>
      <Logo size={300} />
      <Box py={8}>
        <Text textAlign='center'>Crie sua agenda compartilhada</Text>
      </Box>
      <Box minW='lg'>
        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {touched.email && (
            <FormHelperText textColor='red.300'>{errors.email}</FormHelperText>
          )}
        </FormControl>
        <FormControl id='password' isRequired mt={4}>
          <FormLabel>Senha</FormLabel>
          <Input
            type='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && (
            <FormHelperText> {errors.password}</FormHelperText>
          )}
        </FormControl>
        <FormControl id='username' isRequired mt={4}>
          <InputGroup mt={6}>
            <InputLeftAddon children='clock.work/' />
            <Input
              type='text'
              placeholder='username'
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </InputGroup>
          {touched.username && (
            <FormHelperText>{errors.username}</FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box>
        <Button
          onClick={handleSubmit}
          colorScheme='blue'
          size='lg'
          w='lg'
          mt='6'
          fontSize='lg'
          isLoading={isSubmitting}
        >
          Cadastrar
        </Button>
      </Box>
      <Box my='8'>
        <Link href='/'>Já possui uma conta? Acesse!</Link>
      </Box>
    </Container>
  );
}
