import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Logo, useAuth } from '../components';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

export default function Login() {
  const [auth, { login }] = useAuth();
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
    onSubmit: login,
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    auth.user && router.push('/agenda');
  }, [auth.user]);

  return (
    <Container p={8} border='1px solid red' maxWidth='5xl' centerContent>
      <Logo />
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
          Entrar
        </Button>
      </Box>
      <Box my='8'>
        <Link href='/signup'>Ainda não possui uma conta? Cadastre-se!</Link>
      </Box>
    </Container>
  );
}
