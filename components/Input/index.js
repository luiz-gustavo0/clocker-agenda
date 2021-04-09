import { mask, unMask } from 'remask';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
} from '@chakra-ui/react';

export const Input = ({
  error,
  label,
  touched,
  onChange,
  mask: pattern,
  ...props
}) => {
  const handleChange = (event) => {
    const unmaskedValue = unMask(event.target.value);
    const maskedValue = mask(unmaskedValue, pattern);

    onChange && onChange(event.target.name)(maskedValue);
  };

  return (
    <FormControl id={props.name} isRequired mb='6'>
      <FormLabel>{label}</FormLabel>
      <InputBase {...props} onChange={pattern ? handleChange : onChange} />

      {touched && <FormHelperText textColor='red.500'>{error}</FormHelperText>}
    </FormControl>
  );
};
