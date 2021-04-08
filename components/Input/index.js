import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
} from '@chakra-ui/react';

export const Input = ({ error, label, touched, ...props }) => {
  return (
    <FormControl id={props.name} isRequired mb='6'>
      <FormLabel>{label}</FormLabel>
      <InputBase {...props} />

      {touched && <FormHelperText textColor='red.500'>{error}</FormHelperText>}
    </FormControl>
  );
};
