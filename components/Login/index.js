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
import { Logo } from '../Logo';
import Link from 'next/link';
import { firebaseClient, persistenceMode } from '../../config/firebase/client';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
});

export const Login = () => {
  const {
    values,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    isSubmitting,
  } = useFormik({
    onSubmit: async (values, form) => {
      firebaseClient.auth().setPersistence(persistenceMode);
      try {
        const user = await firebaseClient
          .auth()
          .signInWithEmailAndPassword(values.email, values.password);
        console.log('User:', user);
      } catch (error) {
        console.log('ERROR:', error);
      }
    },
    validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
  });

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
};
