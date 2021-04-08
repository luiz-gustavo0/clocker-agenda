import * as yup from 'yup';
import { ErrorMessage, useFormik } from 'formik';
import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

import { Input } from '../Input';
import axios from 'axios';

const setSchedule = async (data) =>
  axios({
    method: 'post',
    url: '/api/schedule',
    data: {
      ...data,
      username: window.location.pathname,
    },
  });

const ModalTimeBlock = ({ isOpen, onClose, onComplete, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Faça sua reserva</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button bg='blue.500' color='#fff' mr='3' onClick={onComplete}>
          Reservar Horário
        </Button>
        <Button variant='ghost'>Canelar</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export const TimeBlock = ({ time }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevState) => !prevState);

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
  } = useFormik({
    onSubmit: (values) => setSchedule(values),
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Preenchimento obrigatório'),
      phone: yup.string().required('Preenchimento obrigatório'),
    }),
  });

  return (
    <Button p='8' bg='blue.500' color='#fff' onClick={toggle}>
      {time}
      <ModalTimeBlock
        isOpen={isOpen}
        onClose={toggle}
        onComplete={handleSubmit}
      >
        <>
          <Input
            label='Nome'
            type='text'
            placeholder='Nome'
            name='name'
            touched={touched.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            size='lg'
          />
          <Input
            label='Telefone'
            type='text'
            placeholder='Telefone'
            name='phone'
            touched={touched.phone}
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            size='lg'
          />
        </>
      </ModalTimeBlock>
    </Button>
  );
};
