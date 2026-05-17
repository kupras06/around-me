import type React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { InputText } from '@/craftrn-ui/components/InputText';

type EmailInputProps = {
  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

export function EmailInput({ email, setEmail, disabled }: EmailInputProps) {
  return (
    <InputText
      label="Email"
      value={email}
      onChangeText={setEmail}
      itemLeft={<IconSymbol name="mail" color="contentSecondary" />}
      keyboardType="email-address"
      autoComplete="email"
      editable={!disabled}
    />
  );
}
