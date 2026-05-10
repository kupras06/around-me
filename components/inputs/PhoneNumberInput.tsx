import type React from 'react';
import { MaskedInputText } from '@/craftrn-ui/components/InputText';

type PhoneNumberInputProps = {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
};

export function PhoneNumberInput({
  phoneNumber,
  setPhoneNumber,
}: PhoneNumberInputProps) {
  return (
    <MaskedInputText
      mask="+1 ([000]) [000]-[0000]"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      keyboardType="numeric"
      placeholder="Enter phone number"
    />
  );
}
