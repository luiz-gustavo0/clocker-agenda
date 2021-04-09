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
import { format } from 'date-fns';

const setSchedule = async ({ date, ...data }) =>
  axios({
    method: 'post',
    url: '/api/schedule',
    data: {
      ...data,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', ''),
    },
  });

const ModalTimeBlock = ({
  isOpen,
  onClose,
  onComplete,
  isSubmitting,
  children,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Faça sua reserva</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        {!isSubmitting && <Button variant='ghost'>Canelar</Button>}
        <Button
          bg='blue.500'
          color='#fff'
          mr='3'
          onClick={onComplete}
          isLoading={isSubmitting}
        >
          Reservar Horário
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export const TimeBlock = ({ time, date }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevState) => !prevState);

  const {
    values,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
    isSubmitting,
  } = useFormik({
    onSubmit: async (values) => {
      try {
        await setSchedule({ ...values, time, date });
        toggle();
      } catch (err) {
        console.log(err);
      }
    },
    initialValues: {
      name: '',
      phone: '',
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
        isSubmitting={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            size='lg'
          />
        </>
      </ModalTimeBlock>
    </Button>
  );
};
